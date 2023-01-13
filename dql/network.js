import * as tf from '@tensorflow/tfjs'

// Dueling Deep Q-Network
class Network {
  constructor ({ inputShape, layers, outputShape }) {
    const inputs = tf.input({ shape: [inputShape] })
    let outputs = inputs
    layers.forEach(layer => {
      outputs = tf.layers.dense(layer).apply(outputs)
    })
    const A = tf.layers.dense({ units: outputShape }).apply(outputs)
    // // const V = tf.layers.dense({ units: 1 }).apply(outputs)
    // // const Q = tf.layers.add().apply([A, V]);
    this.model = tf.model({ inputs, outputs: A })
    this.model.compile({ loss: 'meanSquaredError', optimizer: 'adam' })
  }

  predict (observation) {
    return this.model.predict(tf.tensor(observation).reshape([1, -1]))
  }
}

export default Network
