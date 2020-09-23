const ssr = require('./ssr')
const request = require('request')
const express = require('express')
const app = express()
const port = 5000
const reactUrl = 'http://localhost:3000'

app.use('/sockjs-node', (req, res, next) => {
  return res.status(200).send('Unsupport-socket')
})

app.use('*.(js|jpg|png|css|ico|json|map|txt)', (req, res, next) => {
  const url = `${reactUrl}${req.originalUrl}`
  return request(url).pipe(res)
})

app.get('*', async (req, res, next) => {
  const url = `${reactUrl}${req.originalUrl}`
  const { html, ttRenderMs } = await ssr(url)
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`)
  return res.status(200).send(html) // Serve prerendered page as response.
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send({ error: err.message })
})

app.use(function (req, res) {
  res.status(404)
  res.send({ error: 'Api not found' })
})

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
})
