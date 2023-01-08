// eslint-disable-next-line no-unused-vars
class Game {
  constructor ({ settings }) {
    // eslint-disable-next-line no-undef
    this.ball = new Ball({ settings })
    this.bricks = []
    this.display = settings.display
    this.lost = false
    this.multiplier = 1
    // eslint-disable-next-line no-undef
    this.paddle = new Paddle({ ball: this.ball, settings })
    this.score = 0
    const brickHeight = Math.round(settings.brick.height)
    const brickPadding = Math.round(settings.brick.padding)
    const brickWidth = Math.round(settings.brick.width)
    const padding = Math.round(settings.padding)
    const cols = Math.floor((this.display.canvas.width - padding * 2) / (brickPadding + brickWidth))
    const rows = settings.rows
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const margin = Math.max(padding, (this.display.canvas.width - cols * (brickPadding + brickWidth) + brickPadding) / 2)
        // eslint-disable-next-line no-undef
        const brick = new Brick({ alpha: settings.alpha, color: settings.brick.colors[Math.floor(Math.random() * settings.brick.colors.length)], height: brickHeight, width: brickWidth, x: col * (brickPadding + brickWidth) + brickWidth / 2 + margin, y: row * (brickHeight + brickPadding * 0.8) + brickHeight / 2 + margin })
        this.bricks.push(brick)
      }
    }
    this.polygon = this.createPolygon()
  }

  createPolygon () {
    return [
      { x: 0, y: 0 },
      { x: this.display.canvas.width, y: 0 },
      { x: this.display.canvas.width, y: this.display.canvas.height },
      { x: 0, y: this.display.canvas.height }
    ]
  }

  drawBricks () {
    for (const brick of this.bricks) {
      if (!brick.hit) {
        brick.draw(this.display.ctx)
      }
    }
  }

  gameOver (reward) {
    this.lost = true
    this.reward = reward
  }

  getCollision () {
    // eslint-disable-next-line no-undef
    let touches = getTouches(this.ball.polygon, this.polygon)
    if (touches) {
      const directions = Object.keys(touches)
      if (directions.length > 1) {
        // eslint-disable-next-line no-undef
        return { direction: 'both', type: 'border', ...getCentroid(Object.values(touches)) }
      }
      return { direction: directions[0], type: 'border', ...touches[directions[0]] }
    }
    if (!this.paddle.ghost) {
      // eslint-disable-next-line no-undef
      touches = getTouches(this.ball.polygon, this.paddle.polygon)
      if (touches) {
        if (this.multiplier === 1) {
          this.score = Math.round(this.score / 2)
          if (this.score === 1) {
            this.gameOver(-1)
          }
        }
        this.multiplier = 1
        const directions = Object.keys(touches)
        if (directions.length > 1) {
          // eslint-disable-next-line no-undef
          return { direction: 'both', type: 'paddle', ...getCentroid(Object.values(touches)) }
        }
        return { direction: directions[0], type: 'paddle', ...touches[directions[0]] }
      }
    }
    for (const brick of this.bricks) {
      if (!brick.hit) {
        // eslint-disable-next-line no-undef
        touches = getTouches(this.ball.polygon, brick.polygon)
        if (touches) {
          brick.hit = true
          this.score += this.multiplier++
          if (this.bricks.filter(brick => !brick.hit).length === 0) {
            this.score *= 2
            this.gameOver(1)
          }
          const directions = Object.keys(touches)
          if (directions.length > 1) {
            // eslint-disable-next-line no-undef
            return { brick, direction: 'both', type: 'brick', ...getCentroid(Object.values(touches)) }
          }
          return { direction: directions[0], type: 'brick', ...touches[directions[0]] }
        }
      }
    }
    return null
  }

  update ({ action, frame }) {
    this.reward = 0
    this.drawBricks()
    this.paddle.update({ action, frame })
    this.ball.update()
    if (this.ball.playing) {
      const collision = this.getCollision()
      if (collision) {
        if (collision.type === 'paddle') {
          this.paddle.ghost = true
          const angle = ((collision.x - this.paddle.x + this.paddle.width / 2) * 140) / this.paddle.width + 20
          this.ball.direction = { x: this.ball.speed * -Math.cos(angle * (Math.PI / 180)), y: this.ball.speed * -Math.sin(angle * (Math.PI / 180)) }
        } else {
          this.ball.direction.x *= collision.direction === 'vertical' ? -1 : 1
          this.ball.direction.y *= collision.direction === 'horizontal' ? -1 : 1
        }
        if (collision.direction === 'both') {
          switch (collision.type) {
            case 'border': {
              if (collision.y > this.paddle.y) {
                this.gameOver(-1)
              } else {
                this.ball.direction.x *= -1
                this.ball.direction.y *= -1
              }
              break
            }
            case 'brick': {
              // this.ball.direction.x *= (this.ball.direction.x > 0 && this.ball.x <= collision.brick.x) || (this.ball.direction.x < 0 && this.ball.x >= collision.brick.x) ? -1 : 1
              // this.ball.direction.y *= (this.ball.direction.y > 0 && this.ball.y <= collision.brick.y) || (this.ball.direction.y < 0 && this.ball.y >= collision.brick.y) ? -1 : 1
              break
            }
            case 'paddle': {
              this.ball.direction.x *= (this.ball.direction.x > 0 && this.ball.x <= this.paddle.x) || (this.ball.direction.x < 0 && this.ball.x >= this.paddle.x) ? -1 : 1
              this.ball.direction.y *= (this.ball.direction.y > 0 && this.ball.y <= this.paddle.y) || (this.ball.direction.y < 0 && this.ball.y >= this.paddle.y) ? -1 : 1
              break
            }
          }
        }
        if (collision.type === 'border' && collision.y === this.display.canvas.height) {
          this.gameOver(-1)
        }
      }
    }
    return this.reward
  }
}
