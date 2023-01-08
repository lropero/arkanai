// eslint-disable-next-line no-unused-vars
class Memory {
  constructor ({ size }) {
    this.replay = []
    this.size = size
  }

  add = ({ action, newState, reward, state }) => {
    this.replay.push({ action, newState, reward, state })
    while (this.replay.length > this.size) {
      this.replay.shift()
    }
  }
}
