// eslint-disable-next-line no-unused-vars
class NeuralNetwork {
  constructor (layers) {
    this.layers = []
    for (let i = 0; i < layers.length - 1; i++) {
      this.layers.push(new Layer({ inputCount: layers[i], outputCount: layers[i + 1] }))
    }
  }

  static feedForward ({ inputs, network }) {
    // eslint-disable-next-line no-undef
    let outputs = Layer.feedForward({ activate: relu, inputs, layer: network.layers[0] })
    for (let i = 1; i < network.layers.length; i++) {
      // eslint-disable-next-line no-undef
      outputs = Layer.feedForward({ activate: i === network.layers.length - 1 ? x => x : relu, inputs: outputs, layer: network.layers[i] })
    }
    // eslint-disable-next-line no-undef
    return softmax(outputs)
  }

  static mutate ({ amount, network }) {
    for (const layer of network.layers) {
      for (let i = 0; i < layer.biases.length; i++) {
        // eslint-disable-next-line no-undef
        layer.biases[i] = lerp(layer.biases[i], Math.random(), amount)
      }
      for (let i = 0; i < layer.weights.length; i++) {
        for (let j = 0; j < layer.weights[i].length; j++) {
          // eslint-disable-next-line no-undef
          layer.weights[i][j] = lerp(layer.weights[i][j], Math.random(), amount)
        }
      }
    }
  }
}

class Layer {
  constructor ({ inputCount, outputCount }) {
    this.biases = new Array(outputCount)
    this.inputs = new Array(inputCount)
    this.outputs = new Array(outputCount)
    this.weights = []
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount)
    }
    Layer.randomize(this)
  }

  static feedForward ({ activate, inputs, layer }) {
    for (let i = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = inputs[i]
    }
    for (let i = 0; i < layer.outputs.length; i++) {
      let sum = 0
      for (let j = 0; j < layer.inputs.length; j++) {
        sum += layer.inputs[j] * layer.weights[j][i]
      }
      layer.outputs[i] = activate(sum + layer.biases[i])
    }
    return layer.outputs
  }

  static randomize (layer) {
    for (let i = 0; i < layer.biases.length; i++) {
      layer.biases[i] = Math.random()
    }
    for (let i = 0; i < layer.inputs.length; i++) {
      for (let j = 0; j < layer.outputs.length; j++) {
        layer.weights[i][j] = Math.random()
      }
    }
  }
}
