import _ from 'lodash'

class Memory {
  constructor ({ batchSize, size }) {
    this.batchSize = batchSize
    this.replay = []
    this.size = size
  }

  add = memory => {
    this.replay.push(memory)
    while (this.replay.length > this.size) {
      this.replay.shift()
    }
  }

  sample = () => {
    if (this.replay.length > this.batchSize) {
      return _.sampleSize(this.replay, this.batchSize)
    }
  }
}

export default Memory
