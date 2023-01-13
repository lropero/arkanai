import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', (request, response) => {
  response.sendFile(path.join(`${__dirname}/../public/index.html`))
})

router.post('/frame', (request, response) => {
  const agent = request.app.get('agent')
  agent.remember(request.body)
  const action = agent.act()
  response.send(action)
})

export default router
