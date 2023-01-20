import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', (request, response) => {
  response.sendFile(path.resolve('../public/index.html'))
})

router.post('/frame', async (request, response) => {
  const agent = request.app.get('agent')
  agent.remember(request.body)
  await agent.learn()
  response.send(`${agent.act()}`)
})

export default router
