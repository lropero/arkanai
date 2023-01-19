import * as tf from '@tensorflow/tfjs-node'

class DuelingQ extends tf.layers.Layer {
  call (inputs) {
    const [A, V] = inputs
    return tf.add(V, tf.sub(A, tf.mean(A, 1, true)))
  }

  computeOutputShape (inputShape) {
    return inputShape[0]
  }

  getClassName () {
    return 'DuelingQ'
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
    const Q = new DuelingQ().apply([A, V])
    this.A = tf.model({ inputs, outputs: A })
    this.Q = tf.model({ inputs, outputs: Q })
    this.Q.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(settings.alpha) })
    this.updateAdvantage()
  }

  advantage (states) {
    return this.A.predict(tf.tensor(states))
  }

  getWeights () {
    return { aWeights: this.A.getWeights(), qWeights: this.Q.getWeights() }
  }

  q (states) {
    return this.Q.predict(tf.tensor(states))
  }

  setWeights ({ aWeights, qWeights }) {
    this.A.setWeights(aWeights)
    this.Q.setWeights(qWeights)
  }

  async train ({ q, states }) {
    const x = tf.tensor(states)
    const y = tf.tensor(q)
    await this.Q.trainOnBatch(x, y)
    x.dispose()
    y.dispose()
    this.updateAdvantage()
  }

  updateAdvantage () {
    const weights = this.Q.getWeights()
    weights.splice(-2)
    this.A.setWeights(weights)
  }
}

export default Network
