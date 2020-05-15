const express           = require('express');

let accountSid        = process.env.TWILIO_ACCOUNT_SID;
let authToken         = process.env.TWILIO_AUTH_TOKEN;

const client            = require('twilio')(accountSid, authToken);
const VoiceResponse     = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const ClientCapability  = require('twilio').jwt.ClientCapability;
const cors              = require( 'cors' );
const app               = express();

app.use( express.static('static') );

//const corsOptions = {
//    origin: 'https://phone.app.lighting'
//};


app.get( '/', cors(), (req, res) => {
    res.sendFile('/index.html');
});

app.get('/voice-token', (req, res) => {
    const identity = 'the_user_id';
    
    const capability = new ClientCapability({
	'accountSid': accountSid,
	'authToken': authToken
    });

    capability.addScope(new ClientCapability.IncomingClientScope(identity));   
    capability.addScope(new ClientCapability.OutgoingClientScope({
	'applicationSid': process.env.TWILIO_TWIML_APP_SID,
	'clientName': identity
    }) );
    
    // Set headers in response
    // res.setStatusCode(200);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTION, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Request-With, Accept');
    // res.set("Content-Type", "application/json");

    // Include token in a JSON response
    //res.writeHead( 200, "text/json" );
    res.send({ 'identity': identity, 'token': capability.toJwt() } );
});


//app.listen(8888, () => console.log('Example app listening at http://localhost:8888'));
