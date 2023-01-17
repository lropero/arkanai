import _ from 'lodash'

class Memory {
  constructor ({ settings }) {
    this.batchSize = settings.batchSize
    this.replay = []
    this.size = settings.size
  }

  add = memory => {
    this.replay.push(memory)
    while (this.replay.length > this.size) {
      this.replay.shift()
    }
  }

  sample = () => {
    return this.replay.length >= this.batchSize ? _.sampleSize(this.replay, this.batchSize) : []
  }
}

export default Memory
