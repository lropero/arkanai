/* eslint-disable no-undef, no-unused-vars */

class Paddle extends Polygon {
  constructor ({ ball, settings }) {
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
    this.speed = settings.paddle.speed
    this.width = paddleWidth >= ballDiameter && paddleWidth < window.display.canvas.width - 1 ? paddleWidth : ballDiameter
    this.x = window.display.canvas.width / 2
    this.y = window.display.canvas.height - this.height / 2 - padding
    this.ball.x = this.x
    this.ball.y = this.y - this.height / 2 - this.ball.radius
    // this.setControls()
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
    this.controls = true
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

  update ({ action, frame }) {
    if (!this.controls) {
      this.goLeft = action === 1
      this.goRight = action === 2
    }
    const goingLeft = this.goLeft && !this.goRight
    const goingRight = !this.goLeft && this.goRight
    if (frame === 0) {
      const angle = Math.floor(Math.random() * 161) + 10
      this.ball.direction = { x: this.ball.speed * -Math.cos(angle * (Math.PI / 180)), y: this.ball.speed * -Math.sin(angle * (Math.PI / 180)) }
      this.ball.playing = true
    }
    if (goingLeft) {
      this.x -= this.speed
    } else if (goingRight) {
      this.x += this.speed
    }
    if (this.x > window.display.canvas.width - this.width / 2) {
      this.x = window.display.canvas.width - this.width / 2
    } else if (this.x < this.width / 2) {
      this.x = this.width / 2
    }
    if (!this.ball.playing) {
      this.ball.x = this.x
    } else if (this.ghost && this.ball.y < this.y - this.height / 2 - this.ball.radius) {
      this.ghost = false
    }
    this.polygon = this.createPolygon()
    this.draw()
  }
}
