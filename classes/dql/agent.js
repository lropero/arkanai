// eslint-disable-next-line no-unused-vars
class Agent {
  constructor ({ settings }) {
    // eslint-disable-next-line no-undef
    this.game = new Game({ settings })
    // eslint-disable-next-line no-undef
    this.memory = new Memory({ size: settings.dql.memorySize })
  }

  act = state => {
    return Math.random() > 0.5 ? 'left' : 'right'
  }

  reset = ({ settings }) => {
    // eslint-disable-next-line no-undef
    this.game = new Game({ settings })
  }

  update = ({ frame }) => {
    const state = [this.game.ball.direction.x, this.game.ball.direction.y, this.game.ball.x, this.game.ball.y, this.game.paddle.x]
    const action = this.act(state)
    const reward = this.game.update({ action, frame })
    const newState = [this.game.ball.direction.x, this.game.ball.direction.y, this.game.ball.x, this.game.ball.y, this.game.paddle.x]
    this.memory.add({ action, newState, reward, state })
  }
}
