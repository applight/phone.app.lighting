const express  = require('express');
const twilio   = require('twilio');
const client   = require('twilio')(process.env.TWILIO_ACCOUNT_SID,
				   process.env.TWILIO_AUTH_TOKEN);
const cors              = require( 'cors' );
const VoiceResponse     = twilio.twiml.VoiceResponse;
const MessagingResponse = twilio.twiml.MessagingResponse;
const ClientCapability  = twilio.jwt.ClientCapability;
const app               = express();

app.use( express.static('static') );

const corsOptions = {
    origin: 'https://phone.app.lighting'
};


app.get( '/', cors(corsOptions), (req, res) => {
    res.sendFile('/static/index.html');
});

app.get('/voice-token', (req, res) => {
    const identity = 'the_user_id';
    
    const capability = new ClientCapability({
	'accountSid': process.env.TWILIO_ACCOUNT_SID,
	'authToken': process.env.TWILIO_AUTH_TOKEN
    });

    capability.addScope(new ClientCapability.IncomingClientScope(identity));   
    capability.addScope(new ClientCapability.OutgoingClientScope({
	'applicationSid': process.env.TWILIO_TWIML_APP_SID,
	'clientName': identity
    }) );
    
    // Set headers in response
    res.setStatusCode(200);
    res.appendHeader('Access-Control-Allow-Origin', '*');
    res.appendHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.appendHeader("Content-Type", "text/plain");

    // Include token in a JSON response
    res.send({
	'identity': identity,
	'token': capability.toJwt()
    });
});
