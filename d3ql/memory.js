import _ from 'lodash'

class Memory {
  constructor ({ settings }) {
    this.batchSize = settings.batchSize
    this.cer = settings.cer
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
    if (this.replay.length >= this.batchSize) {
      const sample = this.cer ? this.replay.slice(-1) : []
      return sample.concat(_.sampleSize(this.replay, this.batchSize - sample.length))
    }
    return []
  }
}

export default Memory
