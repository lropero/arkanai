/* eslint-disable no-undef */

const settings = {
  alpha: 1,
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 8, sides: 12, speed: 5 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 32, padding: 50, width: 80 },
  padding: 30,
  paddle: { color: '#4020d0', height: 18, speed: 5, width: 180 },
  rows: 7
}

const animate = async ({ action = '', frame = 0, game, observation } = {}) => {
  try {
    if (frame === 0) {
      game = new Game({ settings })
    }
    if (!observation) {
      observation = [game.ball.direction.x, game.ball.direction.y, game.ball.x, game.ball.y, game.paddle.x]
    }
    const reward = game.update({ action, frame })
    const state = [game.ball.direction.x, game.ball.direction.y, game.ball.x, game.ball.y, game.paddle.x]
    const terminal = game.lost
    const { data: nextAction } = await axios.post('http://localhost:5000/frame', { action, observation, reward, state, terminal })
    window.requestAnimationFrame(() => animate({ action: nextAction, frame: terminal ? 0 : ++frame, game, observation: state }))
  } catch (error) {
    console.error(error.toString())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const display = {}
  display.canvas = document.getElementById('canvas')
  display.canvas.height = window.innerHeight - 16
  display.canvas.width = window.innerWidth - 16
  display.ctx = display.canvas.getContext('2d')
  settings.display = display
  animate()
})
