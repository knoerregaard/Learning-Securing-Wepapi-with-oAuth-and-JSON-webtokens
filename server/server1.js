const express = require('express');
const request = require('request');
const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const app = express()
const cors = require('cors');
const {google} = require('googleapis');


// Download your OAuth2 configuration from the Google
const keys = require('./../oauth2.keys.json');

const oauth2Client = new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[1]
  );
const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];
const url = oauth2Client.generateAuthUrl({
    scope: scopes,
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
  });


// process.env.PORT is relevant when you use Heroku as a host.
const PORT = 3000 |  process.env.PORT;


//---- Setting up middleware START ----//

//Serve static files folder
app.use(express.static('./../public'))

// Whenever you make cross-domain request you will need to handle cores setup.
// You have to whitelist clients ip adresses, or allow certain ip addresses to make 
// reuqest to your server. Below I am allowing every request to access my server.
app.use(cors({
    'Access-Control-Allow-Origin': '*'
}));

// express.urlencoded() is a method built in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({
    extended: true
}));

//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());

//---- Setting up middleware END ----//


//---- Setting up requesthandlers START ----//
app.use('/static', express.static('public'))

app.get('/login', (req, res)=>{
    res.send(`
        <h2>Login</h2>
        <a href="${url}">login</a>
    `)
});
app.use('/mine-hemmelige-billeder',()=>{

})
app.use('/google/callback', (req, res)=>{
    oauth2Client.getToken(req.query.code).then((result)=>{

        oauth2Client.setCredentials({
            access_token: result.tokens.access_token       
        });

        let prom = new Promise((resolve, reject) => {
        google.oauth2('v2').userinfo.get({
            auth: oauth2Client
        }, (err, data) => (err ? reject(err) : resolve(data)))});

        prom.then((result)=>{
            console.log(result);
            
        })
    })

    //Send the code back to Google to return information about the person.
    res.send(`Perfekt`)
});


//---- Setting up requesthandlers END ----//

//The app is instantiated and ready to go
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
