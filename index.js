import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import Agent from './dql/agent.js'
import routes from './routes.js'

const agentSettings = {
  alpha: 0.0005, // Learning rate
  epsilon: 1, // Exploration rate
  epsilonDecay: 0.01, // Exploration decay
  epsilonMin: 0.01, // Exploration minimum
  gamma: 0.99, // Discount factor
  memory: {
    batchSize: 10,
    size: 1000
  },
  network: {
    inputShape: 5,
    layers: [
      { activation: 'relu', units: 64 },
      { activation: 'relu', units: 64 }
    ],
    outputShape: 3
  }
}

const app = express()
const port = 5000

app.set('agent', new Agent({ settings: agentSettings }))
app.use(cors())
app.use(express.json())
if (app.get('env') === 'development') {
  app.use(
    morgan('dev', {
      skip: (request, response) => response.statusCode === 200
    })
  )
}
app.use('/', routes)
app.use((request, response) => response.sendStatus(404))
app.listen(port)
console.log(`Agent listening on port ${port}`)
