// 初始化画布和上下文
const canvas = document.getElementById('geometry-bg');
const ctx = canvas.getContext('2d');

let particlesArray;

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 鼠标位置对象
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 130) * (canvas.width / 130) // 互动范围
}

// 监听鼠标移动
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// 监听窗口调整大小
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 130) * (canvas.width / 130);
    init(); // 重新初始化
});

// 监听鼠标离开窗口
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// 创建单个粒子类
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // 绘制粒子
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#666666'; // 粒子颜色，较暗的星点
        ctx.fill();
    }
    // 更新粒子位置和鼠标互动
    update() {
        // 确保粒子在画布内
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // 检查鼠标互动 (核心代码：鼠标排斥效果)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 1; // 向右排斥
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 1; // 向左排斥
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 1; // 向下排斥
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 1; // 向上排斥
            }
        }

        // 移动粒子
        this.x += this.directionX;
        this.y += this.directionY;
        // 绘制
        this.draw();
    }
}

// 初始化粒子数组
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; // 调整粒子密度
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5; // 粒子大小 0.5 - 2.5
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; // 调整移动速度
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#a3b1ff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// 绘制粒子之间的连线 (几何图案核心)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // 连线距离阈值
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000); // 距离越远越透明
                ctx.strokeStyle = `rgba(163, 177, 255, ${opacityValue})`; // 强调蓝色的透明连线
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect(); // 绘制几何连线
}

// 启动
init();
animate();