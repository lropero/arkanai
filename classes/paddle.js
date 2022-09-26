// eslint-disable-next-line no-undef, no-unused-vars
class Paddle extends Polygon {
  constructor ({ ball, brain, canvas, isBest, settings }) {
    super()
    const ballDiameter = Math.round(settings.ball.radius) * 2
    const padding = Math.round(settings.padding)
    const paddleHeight = Math.round(settings.paddle.height)
    const paddleWidth = Math.round(settings.paddle.width)
    this.alpha = isBest ? 1 : settings.alpha
    this.ball = ball
    this.color = isBest ? '#ccc' : settings.paddle.color
    this.ghost = true
    this.goLeft = false
    this.goRight = false
    this.height = paddleHeight > 0 ? paddleHeight : 1
    this.speed = settings.paddle.speed
    this.width = paddleWidth >= ballDiameter && paddleWidth < canvas.width - 1 ? paddleWidth : ballDiameter
    this.x = canvas.width / 2
    this.y = canvas.height - this.height / 2 - padding
    if (brain) {
      this.brain = brain
    } else {
      this.setControls()
    }
  }

  createPolygon () {
    return [
      { x: this.x - this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y - this.height / 2 },
      { x: this.x + this.width / 2, y: this.y + this.height / 2 },
      { x: this.x - this.width / 2, y: this.y + this.height / 2 }
    ]
  }

  setControls () {
    document.onkeydown = event => {
      switch (event.key) {
        case 'ArrowLeft': {
          this.goLeft = true
          break
        }
        case 'ArrowRight': {
          this.goRight = true
          break
        }
      }
    }
    document.onkeyup = event => {
      switch (event.key) {
        case 'ArrowLeft': {
          this.goLeft = false
          break
        }
        case 'ArrowRight': {
          this.goRight = false
          break
        }
      }
    }
  }

  update ({ canvas, ctx, frame }) {
    if (this.brain && frame > 1) {
      const inputs = [(this.x - this.width / 2) / (canvas.width - this.width), (this.ball.x - this.ball.radius) / (canvas.width - this.ball.radius * 2), (canvas.height - this.ball.y - this.ball.radius) / (canvas.height - this.ball.radius * 2), this.ball.direction.x / this.ball.speed, -this.ball.direction.y / this.ball.speed]
      // eslint-disable-next-line no-undef
      const outputs = NeuralNetwork.feedForward({ inputs, network: this.brain })
      this.goLeft = outputs[0] > 0.5
      this.goRight = outputs[1] > 0.5
    }
    const goingLeft = this.goLeft && !this.goRight
    const goingRight = !this.goLeft && this.goRight
    if (frame === 1) {
      this.ball.x = this.x
      this.ball.y = this.y - this.height / 2 - this.ball.radius
    } else if (frame === 200) {
      const angle = goingLeft ? 40 : goingRight ? 140 : 90 // Math.floor(Math.random() * 161) + 10
      this.ball.direction = { x: this.ball.speed * -Math.cos(angle * (Math.PI / 180)), y: this.ball.speed * -Math.sin(angle * (Math.PI / 180)) }
      this.ball.playing = true
    }
    if (goingLeft) {
      this.x -= this.speed
    } else if (goingRight) {
      this.x += this.speed
    }
    if (this.x > canvas.width - this.width / 2) {
      this.x = canvas.width - this.width / 2
    } else if (this.x < this.width / 2) {
      this.x = this.width / 2
    }
    if (!this.ball.playing) {
      this.ball.x = this.x
    } else if (this.ghost && this.ball.y < this.y - this.height / 2 - this.ball.radius) {
      this.ghost = false
    }
    this.polygon = this.createPolygon()
    this.draw(ctx)
  }
}
