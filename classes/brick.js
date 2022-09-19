// eslint-disable-next-line no-undef, no-unused-vars
class Brick extends Polygon {
  constructor ({ alpha, color, height, width, x, y }) {
    super()
    this.alpha = alpha
    this.color = color
    this.height = height
    this.hit = false
    this.width = width
    this.x = x
    this.y = y
    this.polygon = this.createPolygon()
  }

  createPolygon () {
    return [
      { x: this.x - this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y + this.height / 2 },
      { x: this.x - this.width / 2, y: this.y + this.height / 2 }
    ]
  }
}
