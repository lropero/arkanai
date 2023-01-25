import * as tf from '@tensorflow/tfjs-node'

class DuelingQLayer extends tf.layers.Layer {
  static className = 'DuelingQLayer'

  call (inputs) {
    const [A, V] = inputs
    return tf.add(V, tf.sub(A, tf.mean(A, 1, true)))
  }

  computeOutputShape (inputShape) {
    return inputShape[0]
  }
}

tf.serialization.registerClass(DuelingQLayer)

// Dueling Deep Q-Network
class Network {
  constructor ({ settings }) {
    const inputs = tf.input({ shape: [settings.inputSize] })
    let outputs = inputs
    settings.layers.forEach(layer => {
      outputs = tf.layers.dense(layer).apply(outputs)
    })
    const A = tf.layers.dense({ units: settings.outputSize }).apply(outputs)
    const V = tf.layers.dense({ units: 1 }).apply(outputs)
    const Q = new DuelingQLayer().apply([A, V])
    this.A = tf.model({ inputs, outputs: A })
    this.Q = tf.model({ inputs, outputs: Q })
    this.Q.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(settings.alpha) })
    this.updateAdvantage()
  }

  advantage (states) {
    return this.A.predict(tf.tensor(states))
  }

  getWeights () {
    return this.Q.getWeights()
  }

  q (states) {
    return this.Q.predict(tf.tensor(states))
  }

  setWeights (weights) {
    this.Q.setWeights(weights)
    this.updateAdvantage()
  }

  async train ({ q, states }) {
    const x = tf.tensor(states)
    const y = tf.tensor(q)
    await this.Q.trainOnBatch(x, y)
    this.updateAdvantage()
    x.dispose()
    y.dispose()
  }

  updateAdvantage () {
    const weights = this.Q.getWeights()
    weights.splice(-2)
    this.A.setWeights(weights)
  }
}

export default Network
