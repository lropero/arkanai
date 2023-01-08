const settings = {
  ball: { colors: ['blue', 'green', 'red', 'white', 'yellow'], radius: 8, sides: 12, speed: 5 },
  brick: { colors: ['#957dad', '#d291bc', '#e0bbe4', '#fec8d8', '#ffdfd3'], height: 32, padding: 50, width: 80 },
  padding: 30,
  paddle: { color: '#4020d0', height: 18, speed: 5, width: 180 },
  rows: 7
}

// Deep Q Learning settings
settings.dql = {
  agents: 3,
  memorySize: 1000
}

settings.alpha = settings.dql.agents > 1 ? 0.2 : 1

const animate = ({ agents, frame = 0 }) => {
  const agentsPlaying = agents.filter(agent => !agent.game.lost)
  if (agentsPlaying.length > 0) {
    const { display } = settings
    display.ctx.clearRect(0, 0, display.canvas.width, display.canvas.height)
    for (const agent of agentsPlaying) {
      agent.update({ frame })
    }
  } else {
    agents.forEach(agent => agent.reset({ settings }))
  }
  if (agents.every(agent => agent.memory.replay.length === settings.dql.memorySize)) {
    agents.forEach(agent => {
      console.log(agent.memory)
    })
  } else {
    window.requestAnimationFrame(() => animate({ agents, frame: agentsPlaying.length > 0 ? ++frame : 0 }))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const display = {}
  display.canvas = document.getElementById('canvas')
  display.canvas.height = window.innerHeight - 16
  display.canvas.width = window.innerWidth - 16
  display.ctx = display.canvas.getContext('2d')
  settings.display = display
  // eslint-disable-next-line no-undef
  const agents = new Array(settings.dql.agents > 0 ? settings.dql.agents : 1).fill().map(() => new Agent({ settings }))
  animate({ agents })
})
