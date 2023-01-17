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
    let action
    if (Math.random() < this.epsilon) {
      action = Math.floor(Math.random() * this.actionSpace.length)
    } else {
      action = tf.tidy(() => {
        const { state } = this.memory.replay[this.memory.replay.length - 1]
        const actions = this.networkOnline.advantage([state])
        return actions.argMax(1).dataSync()[0]
      })
    }
    return action
  }

  learn = async () => {
    const memories = this.memory.sample()
    if (memories.length === this.memory.batchSize) {
      if (this.tauCounter++ % this.tau === 0) {
        this.networkTarget.setWeights(this.networkOnline.getWeights())
        console.log(`numTensors: ${tf.memory().numTensors}, epsilon: ${this.epsilon}`)
      }
      const states = memories.map(memory => memory.state)
      const newStates = memories.map(memory => memory.newState)
      let advantageOnline, qOnline
      tf.tidy(() => {
        advantageOnline = this.networkOnline.advantage(states).arraySync()
        qOnline = this.networkOnline.q(states).arraySync()
        const actions = this.networkOnline.advantage(newStates).argMax(1).arraySync()
        const advantageTarget = this.networkTarget.advantage(newStates).arraySync()
        const qTarget = this.networkTarget.q(newStates).arraySync()
        memories.forEach((memory, index) => {
          advantageOnline[index][actions[index]] = memory.reward + (this.gamma * advantageTarget[index][actions[index]] * 1 - memory.terminal ? 1 : 0)
          qOnline[index][actions[index]] = memory.reward + (this.gamma * qTarget[index][actions[index]] * 1 - memory.terminal ? 1 : 0)
        })
      })
      await this.networkOnline.train({ advantageOnline, qOnline, states })
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
