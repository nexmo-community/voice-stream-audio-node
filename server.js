require('dotenv').config({ path: '.env' })
const express = require('express')
const app = express()
const path = require('path')
const Vonage = require('@vonage/server-sdk')

const TO_NUMBER = process.env.TO_NUMBER
const VONAGE_NUMBER = process.env.VONAGE_NUMBER
const BASE_URL = process.env.BASE_URL

const VONAGE_API_KEY = process.env.VONAGE_API_KEY
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET
const VONAGE_APPLICATION_ID = process.env.VONAGE_APPLICATION_ID
const VONAGE_APPLICATION_PRIVATE_KEY_PATH = process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH

const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: VONAGE_APPLICATION_PRIVATE_KEY_PATH
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve contents of public folder in the /audio path
app.use('/audio', express.static(path.join(__dirname, 'public')))

const answer_url = BASE_URL + '/audio/answer.json'
const audio_url = BASE_URL + '/audio/music.mp3'
const event_url = BASE_URL + '/webhooks/events'

const makeOutboundCall = (req, res) => {
  console.log('Making the outbound call...')

  vonage.calls.create({
    to: [{
      type: 'phone',
      number: TO_NUMBER
    }],
    from: {
      type: 'phone',
      number: VONAGE_NUMBER
    },
    answer_url: [answer_url],
    event_url: [event_url]
  })
}

const start_stream = (call_uuid) => {
  console.log(`streaming ${audio_url} into ${call_uuid}`)
  vonage.calls.stream.start(call_uuid, { stream_url: [audio_url], loop: 0 }, (err, res) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(res)
    }
  })
}

const stop_stream = (call_uuid) => {
  vonage.calls.stream.stop(call_uuid, (err, res) => {
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
      vonage.calls.update(call_uuid, { action: 'hangup' }, (req, res) => {
        console.log("Disconnecting...")
      });
    }, 20000)


  }
  res.status(200).end()
})

// Serve app on port 3000
app.listen(3000)