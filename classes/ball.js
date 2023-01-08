// eslint-disable-next-line no-undef, no-unused-vars
class Ball extends Polygon {
  constructor ({ settings }) {
    super()
    const ballRadius = Math.round(settings.ball.radius)
    const ballSides = Math.round(settings.ball.sides)
    this.alpha = settings.alpha
    this.color = settings.ball.colors[Math.floor(Math.random() * settings.ball.colors.length)]
    this.direction = { x: 0, y: 0 }
    this.display = settings.display
    this.playing = false
    this.radius = ballRadius
    this.sides = ballSides > 2 ? ballSides : 3
    this.speed = settings.ball.speed
  }

  createPolygon () {
    const points = []
    const angle = (2 * Math.PI) / this.sides
    for (let i = 0; i < this.sides; i++) {
      points.push({
        x: this.x + this.radius * Math.sin(i * angle),
        y: this.y + this.radius * Math.cos(i * angle)
      })
    }
    return points
  }

  update () {
    if (this.x && this.y) {
      if (this.playing) {
        this.x += this.direction.x
        this.y += this.direction.y
        if (this.x - this.radius < 0) {
          this.x = this.radius
        }
        if (this.x + this.radius > this.display.canvas.width) {
          this.x = this.display.canvas.width - this.radius
        }
        if (this.y - this.radius < 0) {
          this.y = this.radius
        }
        if (this.y + this.radius > this.display.canvas.height) {
          this.y = this.display.canvas.height - this.radius
        }
      }
      this.polygon = this.createPolygon()
      this.draw(this.display.ctx)
    }
  }
}
