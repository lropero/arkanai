// eslint-disable-next-line no-undef, no-unused-vars
class Paddle extends Polygon {
  constructor ({ ball, canvas, settings }) {
    super()
    const ballDiameter = Math.round(settings.ball.radius) * 2
    const padding = Math.round(settings.padding)
    const paddleHeight = Math.round(settings.paddle.height)
    const paddleWidth = Math.round(settings.paddle.width)
    this.alpha = settings.alpha
    this.ball = ball
    this.color = settings.paddle.color
    this.ghost = true
    this.goLeft = false
    this.goRight = false
    this.height = paddleHeight > 0 ? paddleHeight : 1
    this.width = paddleWidth >= ballDiameter && paddleWidth < canvas.width - 1 ? paddleWidth : ballDiameter
    this.x = canvas.width / 2
    this.y = canvas.height - this.height / 2 - padding
  }

  createPolygon () {
    return [
      { x: this.x - this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y + this.height / 2 },
      { x: this.x - this.width / 2, y: this.y + this.height / 2 }
    ]
  }

  update ({ canvas, ctx, frame }) {
    this.goLeft = Math.random() > 0.5
    this.goRight = Math.random() > 0.5
    if (this.ghost && this.ball.y < this.y - this.height / 2 - this.ball.radius) {
      this.ghost = false
    }
    const goingLeft = this.goLeft && !this.goRight
    const goingRight = !this.goLeft && this.goRight
    if (frame === 1) {
      this.ball.x = this.x
      this.ball.y = this.y - this.height / 2 - this.ball.radius
    } else if (frame === 200) {
      const angle = goingLeft ? 40 : goingRight ? 140 : Math.floor(Math.random() * 161) + 10
      this.ball.direction = { x: -Math.cos(angle * (Math.PI / 180)), y: -Math.sin(angle * (Math.PI / 180)) }
      this.ball.playing = true
    }
    if (goingLeft) {
      this.x -= 2.2
    } else if (goingRight) {
      this.x += 2.2
    }
    if (this.x > canvas.width - this.width / 2) {
      this.x = canvas.width - this.width / 2
    } else if (this.x < this.width / 2) {
      this.x = this.width / 2
    }
    if (!this.ball.playing) {
      this.ball.x = this.x
    }
    this.polygon = this.createPolygon()
    this.draw(ctx)
  }
}
