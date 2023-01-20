import * as tf from '@tensorflow/tfjs-node'

import Memory from './memory.js'
import Network from './network.js'

class Agent {
  constructor ({ settings }) {
    this.actionSpace = [...Array(settings.network.outputSize).keys()]
    this.epsilon = settings.epsilon
    this.epsilonDecay = settings.epsilonDecay
    this.epsilonMin = settings.epsilonMin
    this.gamma = settings.gamma
    this.memory = new Memory({ settings: settings.memory })
    this.networkOnline = new Network({ settings: settings.network })
    this.networkTarget = new Network({ settings: settings.network })
    this.tau = settings.tau
    this.tauCounter = 0
  }

  act = () => {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.actionSpace.length)
    } else {
      return tf.tidy(() => {
        const { newState } = this.memory.replay[this.memory.replay.length - 1]
        const actions = this.networkOnline.advantage([newState])
        return actions.argMax(1).dataSync()[0]
      })
    }
  }

  learn = async () => {
    const memories = this.memory.sample()
    if (memories.length === this.memory.batchSize) {
      if (this.tauCounter++ % this.tau === 0) {
        this.networkTarget.setWeights(this.networkOnline.getWeights())
        console.log(`Tensors ${tf.memory().numTensors} | Memory ${this.memory.replay.length} | Epsilon ${this.epsilon}`)
      }
      const states = memories.map(memory => memory.state)
      const newStates = memories.map(memory => memory.newState)
      const [maxActions, qOnline, qTarget] = tf.tidy(() => {
        const maxActions = this.networkOnline.q(newStates).argMax(1).arraySync()
        const qOnline = this.networkOnline.q(states).arraySync()
        const qTarget = this.networkTarget.q(newStates).arraySync()
        return [maxActions, qOnline, qTarget]
      })
      memories.forEach((memory, index) => {
        qOnline[index][memory.action] = memory.reward + (this.gamma * qTarget[index][maxActions[index]] * 1 - memory.terminal ? 1 : 0)
      })
      await this.networkOnline.train({ q: qOnline, states })
      this.epsilon = this.epsilon - this.epsilonDecay
      if (this.epsilon < this.epsilonMin) {
        this.epsilon = this.epsilonMin
      }
    }
  }

  remember = memory => {
    this.memory.add(memory)
  }
}

export default Agent
