// eslint-disable-next-line no-undef, no-unused-vars
class Ball extends Polygon {
  constructor ({ settings }) {
    super()
    const ballRadius = Math.round(settings.ball.radius)
    const ballSides = Math.round(settings.ball.sides)
    this.alpha = settings.alpha
    this.color = settings.games === 1 ? 'white' : settings.ball.colors[Math.floor(Math.random() * settings.ball.colors.length)]
    this.playing = false
    this.radius = ballRadius
    this.sides = ballSides > 2 ? ballSides : 3
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

  update ({ ctx }) {
    if (this.x && this.y) {
      if (this.playing) {
        this.x += this.direction.x
        this.y += this.direction.y
      }
      this.polygon = this.createPolygon()
      this.draw(ctx)
    }
  }
}
