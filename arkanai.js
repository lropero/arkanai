const settings = {
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 8, sides: 12, speed: 5 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 32, padding: 50, width: 80 },
  games: 50,
  layers: [5, 8, 2],
  padding: 30,
  paddle: { color: '#4020d0', height: 18, speed: 5, width: 180 },
  rows: 7
}

settings.alpha = settings.games > 1 ? 0.2 : 1

const animate = ({ canvas, ctx, frame, games }) => {
  const openGames = games.filter(game => !game.lost)
  if (openGames.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const game of openGames) {
      game.update({ canvas, ctx, frame })
    }
  } else {
    const useAI = settings.games > 1
    let bestBrain
    if (useAI && games.length) {
      const scores = games.map(game => game.score)
      const bestScore = Math.max(...scores)
      const bestGames = games.filter(game => game.score === bestScore)
      bestBrain = JSON.stringify(bestGames[Math.floor(Math.random() * bestGames.length)].paddle.brain)
      // eslint-disable-next-line no-undef
      console.log(`Best ${bestScore} <${hash(bestBrain)}>`)
    }
    frame = 0
    games.length = 0
    for (let i = 0; i < settings.games; i++) {
      let brain
      if (useAI) {
        if (bestBrain) {
          brain = JSON.parse(bestBrain)
          if (i > 0) {
            if (Math.random() > 0.3) {
              // eslint-disable-next-line no-undef
              NeuralNetwork.mutate({ amount: 0.1, network: brain })
            } else {
              // eslint-disable-next-line no-undef
              brain = new NeuralNetwork(settings.layers)
            }
          }
        } else {
          // eslint-disable-next-line no-undef
          brain = new NeuralNetwork(settings.layers)
        }
      }
      // eslint-disable-next-line no-undef
      games.push(new Game({ brain, canvas, isBest: bestBrain && i === 0, settings }))
    }
  }
  window.requestAnimationFrame(() => animate({ canvas, ctx, frame: ++frame, games }))
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas')
  canvas.height = window.innerHeight - 16
  canvas.width = window.innerWidth - 16
  animate({ canvas, ctx: canvas.getContext('2d'), games: [] })
})
