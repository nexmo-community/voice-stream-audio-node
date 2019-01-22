require('dotenv').config({ path: '.env' })

const path = require('path')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const TO_NUMBER = process.env.TO_NUMBER
const NEXMO_NUMBER = process.env.NEXMO_NUMBER
const BASE_URL = process.env.BASE_URL

const NEXMO_API_KEY = process.env.NEXMO_API_KEY
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET
const NEXMO_APPLICATION_ID = process.env.NEXMO_APPLICATION_ID
const NEXMO_APPLICATION_PRIVATE_KEY_PATH = process.env.NEXMO_APPLICATION_PRIVATE_KEY_PATH

const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET,
  applicationId: NEXMO_APPLICATION_ID,
  privateKey: NEXMO_APPLICATION_PRIVATE_KEY_PATH
})

app.use('/audio', express.static(path.join(__dirname, 'public')))
const answer_url = BASE_URL + '/audio/answer.json'
const audio_url = BASE_URL + '/audio/music.mp3'

const makeOutboundCall = (req, res) => {
  console.log('Making the outbound call...')

  nexmo.calls.create({
    to: [{
      type: 'phone',
      number: TO_NUMBER
    }],
    from: {
      type: 'phone',
      number: NEXMO_NUMBER
    },
    answer_url: [answer_url]
  })
}

const start_stream = (call_uuid) => {
  console.log(`streaming ${audio_url} into ${call_uuid}`)
  nexmo.calls.stream.start(call_uuid, { stream_url: [audio_url], loop: 0 }, (err, res) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(res)
    }
  })
}

const stop_stream = (call_uuid) => {
  nexmo.calls.stream.stop(call_uuid, (err, res) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(res)
    }
  })
}

app.get('/call', makeOutboundCall)

app.post('/webhooks/events', (req, res) => {
  if (req.body.status == 'answered') {

    const call_uuid = req.body.uuid

    // Play audio into call after 8 secs
    setTimeout(() => {
      start_stream(call_uuid)
      // Stop audio after 30 secs
      setTimeout(() => {
        stop_stream(call_uuid)
      }, 30000)
    }, 8000)

  }
  res.status(200).end()
})

app.listen(3000)