import { useEffect, useState } from 'react'

export default function useViewportInfo() {
  const getViewport = () => {
    if (typeof window === 'undefined') {
      return { width: 1280, height: 720 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  const [viewport, setViewport] = useState(getViewport)

  useEffect(() => {
    const onResize = () => setViewport(getViewport())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const width = viewport.width
  const height = viewport.height

  return {
    width,
    height,
    isMobile: width <= 900 || height <= 680,
    isCompact: width <= 640,
    isShort: height <= 740,
    isTouch:
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) || navigator.maxTouchPoints > 0),
  }
}
