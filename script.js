// --- 0. 从 CDN 引入 Three.js ---
// 注意：在 ES Module 出现之前，我们通过加载脚本来使用它。
// 这里我们使用一种简单的方法，直接在 script 标签中引入，
// 或者在代码中创建一个 `script` 标签来加载。
// 为了演示和易于复制，我将在 JS 开头动态加载它。

(function() {
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
    threeScript.onload = initThreeScene; // 加载完成后初始化场景
    document.head.appendChild(threeScript);
})();

// 场景全局变量
let scene, camera, renderer, starfield, shipGroup;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// --- 1. 初始化 Three.js 场景 ---
function initThreeScene() {
    // 基础设置
    scene = new THREE.Scene();
    // 增加雾气效果，让远处的星星淡出，增加深度感
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 5; // 摄像机位于飞船后方

    renderer = new THREE.WebGLRenderer({ antialias: true }); // 开启抗锯齿
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // --- 2. 创建动态星空 (几何粒子系统) ---
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        size: 1,
        sizeAttenuation: true // 粒子随距离衰减
    });

    const starsVertices = [];
    // 生成 5000 颗星星
    for (let i = 0; i < 5000; i++) {
        // 在一个巨大的立方体内随机分布
        starsVertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starfield = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starfield);

    // --- 3. 代码生成几何飞船 (现代几何风格) ---
    shipGroup = new THREE.Group(); // 创建一个组，方便整体操作

    // 材料：使用 Standard 材料以展示光影
    const shipMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.8,
        flatShading: true // 关键：使用扁平着色，增强几何分面感
    });
    // 材料2：发光效果
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xa3b1ff,
        transparent: true,
        opacity: 0.8
    });

    // 飞船主体 (锥形)
    const bodyGeo = new THREE.ConeGeometry(0.5, 2.5, 6); // 半径, 高度, 分段(6面体)
    const body = new THREE.Mesh(bodyGeo, shipMaterial);
    body.rotation.x = Math.PI / 2; // 旋转，使其朝向 Z 轴正方向
    shipGroup.add(body);

    // 飞船机翼 (扁平六面体)
    const wingGeo = new THREE.BoxGeometry(2.2, 0.05, 1.2);
    const wing = new THREE.Mesh(wingGeo, shipMaterial);
    wing.position.set(0, -0.2, -0.3); // 调整位置
    // 机翼稍微倾斜，更有动感
    wing.rotation.y = 0.1;
    shipGroup.add(wing);

    // 飞船引擎发光器 (圆柱体)
    const engineGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 6);
    const engine = new THREE.Mesh(engineGeo, glowMaterial);
    engine.position.set(0, 0, -1.3); // 位于飞船尾部
    engine.rotation.x = Math.PI / 2;
    shipGroup.add(engine);

    // 将飞船组添加到场景
    scene.add(shipGroup);

    // --- 4. 添加灯光 ---
    const ambientLight = new THREE.AmbientLight(0x333333); // 环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 主方向光，来自前方
    directionalLight.position.set(1, 1, 5).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xa3b1ff, 2, 5); // 引擎处的淡蓝色点光源
    pointLight.position.set(0, 0, -1.5);
    shipGroup.add(pointLight);

    // --- 5. 监听事件 ---
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // 启动动画循环
    animate();
}

// 事件处理函数
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    // 获取鼠标相对于屏幕中心的偏移量 (-1 到 1)
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}

// --- 6. 动画循环 (核心逻辑) ---
function animate() {
    requestAnimationFrame(animate);

    // 6.1 让星空“流掠” (模拟飞行)
    // 我们向 Z 轴正方向移动星星，当它们通过摄像机后重新放置到远处
    const positions = starfield.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 2; // 向前移动星星 (即飞船向前飞)

        // 如果星星飞到了摄像机后面，重新放置到远处
        if (positions[i + 2] > 1000) {
            positions[i + 2] = -1000;
            positions[i] = Math.random() * 2000 - 1000; // 随机 X
            positions[i + 1] = Math.random() * 2000 - 1000; // 随机 Y
        }
    }
    // 关键：通知 Three.js 位置已更新
    starfield.geometry.attributes.position.needsUpdate = true;

    // 6.2 根据鼠标控制飞船转向 (带有平滑插值 Lerp)
    // 目标旋转角度基余鼠标位置
    const targetRotY = mouseX * 0.3; // 左右偏航
    const targetRotX = -mouseY * 0.2; // 上下俯仰
    const targetRotZ = mouseX * -0.3; // 左右转弯时的侧倾 (Bruno Simon 风格细节)

    // 使用线性插值，让旋转更平滑，而不是突变
    shipGroup.rotation.y += (targetRotY - shipGroup.rotation.y) * 0.05;
    shipGroup.rotation.x += (targetRotX - shipGroup.rotation.x) * 0.05;
    shipGroup.rotation.z += (targetRotZ - shipGroup.rotation.z) * 0.1;

    // 让摄像机微微跟随飞船，增加动感
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -10); // 摄像机始终看向前方远处

    // 渲染场景
    renderer.render(scene, camera);
}
