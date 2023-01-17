import * as tf from '@tensorflow/tfjs-node'

class DuelingDeepQ extends tf.layers.Layer {
  static get className () {
    return 'DuelingDeepQ'
  }

  call (inputs) {
    const [A, V] = inputs
    return tf.layers.add().apply([A, V, tf.layers.multiply().apply([tf.mean(A, 1), tf.fill(A.shape, -1)])])
  }

  computeOutputShape (inputShape) {
    return inputShape[0]
  }
}

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
    this.model = tf.model({ inputs, outputs: [A, new DuelingDeepQ().apply([A, V])] })
    this.model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(settings.alpha) })
  }

  advantage (states) {
    return tf.tidy(() => this.model.predict(tf.tensor(states))[0])
  }

  getWeights () {
    return this.model.getWeights()
  }

  q (states) {
    return tf.tidy(() => this.model.predict(tf.tensor(states))[1])
  }

  setWeights (weights) {
    this.model.setWeights(weights)
  }

  async train ({ advantageOnline, qOnline, states }) {
    const x = tf.tensor(states)
    const y = [tf.tensor(advantageOnline), tf.tensor(qOnline)]
    await this.model.trainOnBatch(x, y)
    x.dispose()
    y[0].dispose()
    y[1].dispose()
  }
}

export default Network
