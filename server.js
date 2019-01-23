require('dotenv').config({ path: '.env' })
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Nexmo = require('nexmo')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve contents of public folder in the /audio path
app.use('/audio', express.static(path.join(__dirname, 'public')))

const TO_NUMBER = process.env.TO_NUMBER
const NEXMO_NUMBER = process.env.NEXMO_NUMBER
const BASE_URL = process.env.BASE_URL

const NEXMO_API_KEY = process.env.NEXMO_API_KEY
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET
const NEXMO_APPLICATION_ID = process.env.NEXMO_APPLICATION_ID
const NEXMO_APPLICATION_PRIVATE_KEY_PATH = process.env.NEXMO_APPLICATION_PRIVATE_KEY_PATH

const nexmo = new Nexmo({
  apiKey: NEXMO_API_KEY,
  apiSecret: NEXMO_API_SECRET,
  applicationId: NEXMO_APPLICATION_ID,
  privateKey: NEXMO_APPLICATION_PRIVATE_KEY_PATH
})

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

    // Play audio into call
    start_stream(call_uuid)

    // Disconnect the call after 20 secs
    setTimeout(() => {
      stop_stream(call_uuid)
      nexmo.calls.update(call_uuid, { action: 'hangup' }, (req, res) => {
        console.log("Disconnecting...")
      });
    }, 20000)


  }
  res.status(200).end()
})

// Serve app on port 3000
app.listen(3000)