/* eslint-disable no-undef */

const settings = {
  alpha: 1,
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 2, sides: 12, speed: 2 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 8, padding: 2, width: 18 },
  canvas: { height: 200, width: 200 },
  padding: 20,
  paddle: { color: '#4020d0', height: 5, speed: 2, width: 30 },
  rows: 5
}

const scores = []

const animate = async ({ action = '', frame = 0, game, state } = {}) => {
  try {
    if (frame === 0) {
      if (game) {
        scores.push(game.score)
        const batch = scores.slice(-100)
        console.log(`#${scores.length}: ${game.score.toFixed(2)} (${(batch.reduce((mean, score) => mean + score, 0) / batch.length).toFixed(2)})`)
      }
      game = new Game({ settings })
    }
    if (!state) {
      state = [game.ball.direction.x, game.ball.direction.y, game.ball.x, game.ball.y, game.paddle.x]
    }
    const reward = game.update({ action, frame })
    const newState = [game.ball.direction.x, game.ball.direction.y, game.ball.x, game.ball.y, game.paddle.x]
    const terminal = game.lost
    const { data: nextAction } = await axios.post('http://localhost:5000/frame', { action, newState, reward, state, terminal })
    window.requestAnimationFrame(() => animate({ action: parseInt(nextAction, 10), frame: terminal ? 0 : ++frame, game, state: newState }))
  } catch (error) {
    console.error(error.toString())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const display = {}
  display.canvas = document.getElementById('canvas')
  display.canvas.height = settings.canvas.height ?? window.innerHeight - 16
  display.canvas.width = settings.canvas.width ?? window.innerWidth - 16
  display.ctx = display.canvas.getContext('2d')
  settings.display = display
  animate()
})
