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
    res.sendFile('/index.html');
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
      add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
    res.appendHeader('Access-Control-Allow-Origin', '*');
    res.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTION, HEAD');
    res.appendHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Request-With, Accept');
    res.appendHeader("Content-Type", "application/json");

    // Include token in a JSON response
    res.json({ 'identity': identity, 'token': capability.toJwt() } );
});
