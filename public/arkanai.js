/* eslint-disable no-undef */

const settings = {
  alpha: 1,
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 2, sides: 12, speed: 3 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 8, padding: 2, width: 18 },
  padding: 20,
  paddle: { color: '#4020d0', height: 5, speed: 2, width: 30 },
  rows: 5,
  size: { height: 200, width: 200 }
}

const scores = []

const animate = async ({ action = 0, frame = 0, game, state } = {}) => {
  try {
    if (frame === 0) {
      if (game) {
        const chart = window.chart
        if (chart) {
          scores.push(game.score)
          const batch = scores.slice(-100)
          chart.data.datasets[0].data.push(batch.reduce((mean, score) => mean + score, 0) / batch.length)
          while (chart.data.datasets[0].data.length > batch.length) {
            chart.data.datasets[0].data.shift()
            chart.data.labels.shift()
          }
          chart.data.datasets[1].data = batch
          chart.data.labels.push(scores.length)
          chart.update()
        }
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
  const canvasChart = document.getElementById('chart')
  canvasChart.height = 400
  canvasChart.width = 400
  const canvasGame = document.getElementById('game')
  canvasGame.height = settings.size.height
  canvasGame.width = settings.size.width
  window.chart = new Chart(canvasChart, {
    data: {
      datasets: [
        {
          borderColor: '#4020d0',
          borderWidth: 1,
          data: [],
          label: 'Mean'
        },
        {
          borderColor: 'pink',
          borderWidth: 1,
          label: 'Score'
        }
      ],
      labels: []
    },
    type: 'line'
  })
  window.display = { canvas: canvasGame, ctx: canvasGame.getContext('2d') }
  animate()
})
