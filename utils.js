const getCentroid = polygon => {
  if (polygon.length > 0) {
    return polygon.reduce(
      (centroid, point, index) => {
        centroid.x += point.x
        centroid.y += point.y
        if (index === polygon.length - 1) {
          centroid.x /= polygon.length
          centroid.y /= polygon.length
        }
        return centroid
      },
      { x: 0, y: 0 }
    )
  }
  return null
}

// eslint-disable-next-line no-unused-vars
const getTouches = (polygon1, polygon2) => {
  const touches = { horizontal: [], vertical: [] }
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      const A = polygon1[i]
      const B = polygon1[(i + 1) % polygon1.length]
      const C = polygon2[j]
      const D = polygon2[(j + 1) % polygon2.length]
      const divisor = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)
      const tDividend = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
      const uDividend = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
      if (divisor !== 0) {
        const t = tDividend / divisor
        const u = uDividend / divisor
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          const isHorizontal = C.y === D.y
          const isVertical = C.x === D.x
          if (isHorizontal === isVertical) {
            console.error('isHorizontal === isVertical')
          } else {
            touches[isHorizontal ? 'horizontal' : 'vertical'].push({ x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t) })
          }
        }
      }
    }
  }
  const horizontal = getCentroid(touches.horizontal)
  const vertical = getCentroid(touches.vertical)
  if (horizontal || vertical) {
    return { ...(horizontal && { horizontal }), ...(vertical && { vertical }) }
  }
  return null
}

const lerp = (a, b, interpolation) => a + (b - a) * interpolation
