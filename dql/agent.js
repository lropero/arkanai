import Memory from './memory.js'
import Network from './network.js'

class Agent {
  constructor ({ settings }) {
    this.alpha = settings.alpha
    this.epsilon = settings.epsilon
    this.epsilonDecay = settings.epsilonDecay
    this.epsilonMin = settings.epsilonMin
    this.gamma = settings.gamma
    this.memory = new Memory({ batchSize: settings.memory.batchSize, size: settings.memory.size })
    this.network = new Network({ inputShape: settings.network.inputShape, layers: settings.network.layers, outputShape: settings.network.outputShape })
    // TODO: Target network
  }

  act = () => {
    const { observation } = this.memory.replay[this.memory.replay.length - 1]
    const actions = this.network.predict(observation)
    const action = actions.argMax(1).dataSync()[0]
    switch (action) {
      case 0:
        return ''
      case 1:
        return 'left'
      case 2:
        return 'right'
    }
  }

  remember = memory => {
    this.memory.add(memory)
  }
}

export default Agent
