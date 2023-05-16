# Streaming Audio into a Call with Node.js

This is the sample code for the [Streaming Audio into a Call with Node.js](https://developer.vonage.com/en/blog/stream-audio-into-a-phone-call-with-node-js) blog post.
This project showcases how to stream audio into a call using Node.js. It uses the Vonage Server SDK to make a call to a specified number, then streams audio into the call.

## Prerequisites

- Node.js and npm installed.
- A Vonage account with a Voice API application and linked number.
- Ngrok installed and set up.
- A public domain music file.

## Setup and Installation

Follow the steps below to set up and run this application:

1. **Create a Voice API application:** Use your Vonage account to create a new voice app. Link an existing number to it, or purchase a new one. Note down the application id.

2. **Download the private key:** Download the private key associated with your voice app to your application directory.

3. **Start an ngrok tunnel:** Run `ngrok http 3000` in your terminal to start an ngrok tunnel.

4. **Update the silence.mp3 URL:** In the `/public/answer.json` file, change the hostname of the `silence.mp3` URL to match your ngrok hostname.

5. **Configure environment variables:** Rename the `example.env` file to `.env` and update the variables with your API key, secret, private key file path, and your ngrok URL. Also, specify the 'to' and 'from' numbers for making the call.

6. **Install dependencies:** Run `npm install` in your terminal from the root directory of the project.

7. **Start the application:** Run `node server.js` to start the app.

## Usage

To initiate a call, make a `GET` request to `http://localhost:3000/call`. This will call the configured `TO_NUMBER`.

If all goes well, you will first hear a message, followed by silence. After a few seconds, music will play for 30 seconds and then stop.

**Note**: The music file this application uses (*City Sunshine* by Kevin MacLeod) is in the public domain. For more information, visit [FreePD](https://freepd.com).
