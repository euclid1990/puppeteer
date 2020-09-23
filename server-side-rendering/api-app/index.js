const database = require('./database.json')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 4000

function error (status, msg) {
  var err = new Error(msg)
  err.status = status
  return err
}

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

app.use(cors())
app.use(bodyParser.json())

app.get('/api/healthcheck', async function (req, res, next) {
  res.send({ data: 'OK' })
})

app.use('/api', async function (req, res, next) {
  var key = req.header('Api-Key')
  // If key isn't present
  if (!key) return next(error(400, 'Api key is required'))
  next()
})

app.get('/api/topics', async function (req, res) {
  await sleep(1000)
  res.send({ data: database.topics })
})

app.get('/api/topics/:id', async function (req, res, next) {
  const { id } = req.params
  const topic = database.topics.find(t => t.id === +id)
  if (typeof topic === 'undefined') { return next(error(404, 'Topic not found')) }
  await sleep(250)
  res.send({ data: topic })
})

app.post('/api/signup', async function (req, res, next) {
  const { email, password } = req.body
  await sleep(1000)
  if (!email.length || !password.length) {
    return next(error(400, 'Email and password is required'))
  }
  res.send({ data: 'Sign up successfully' })
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
