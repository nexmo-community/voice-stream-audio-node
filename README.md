Work-in-progress application for forthcoming tutorial.

## Instructions for reviewers ##

To run this application:

1. Create a new voice app and link an existing number to it, or purchase a new one. Make a note of the application id.
2. Download the private key to your application directory.
3. Copy `example.env` to `.env` and configure your API key, secret, private key file path, to/from numbers and Ngrok URL.
4. Run `npm install` to install dependencies.
5. Run `ngrok http 3000` to start tunneling.
6. Run `npm server.js` in the root directory to start the app.
7. Make a `GET` request to `http://localhost:3000/call` to call the configured `TO_NUMBER`.

If all goes well, you should hear a message followed by silence. A few seconds later you will hear some music for 30 seconds which then stops.
