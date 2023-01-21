/* eslint-disable no-unused-vars */

class Polygon {
  draw () {
    const { ctx } = window.display
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
