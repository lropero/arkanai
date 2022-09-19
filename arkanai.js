const settings = {
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 8, sides: 12 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 32, padding: 50, width: 80 },
  games: 50,
  padding: 30,
  paddle: { color: '#253da1', height: 18, width: 180 },
  rows: 7
}

settings.alpha = settings.games > 1 ? 0.5 : 1

const animate = ({ canvas, ctx, frame, games }) => {
  const openGames = games.filter(game => !game.lost)
  if (openGames.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const game of openGames) {
      game.update({ canvas, ctx, frame })
    }
  } else {
    frame = 0
    games.length = 0
    for (let i = 0; i < settings.games; i++) {
      // eslint-disable-next-line no-undef
      games.push(new Game({ AI: settings.games !== 1, canvas, settings }))
    }
  }
  window.requestAnimationFrame(() => animate({ canvas, ctx, frame: ++frame, games }))
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas')
  canvas.height = window.innerHeight - 16
  canvas.width = window.innerWidth - 16
  animate({ canvas, ctx: canvas.getContext('2d'), frame: 0, games: [] })
})
