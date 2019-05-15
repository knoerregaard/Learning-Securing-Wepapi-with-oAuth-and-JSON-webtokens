const express = require('express');
const request = require('request')
const app = express()
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');  //Newer library

// Download your OAuth2 configuration from the Google
const keys = require('./../oauth2.keys.json');

const oauth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[1]
);
const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];
 
const authorizeUrl = oauth2Client.generateAuthUrl({
    scope: scopes,
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

}); 

function verifyToken(req, res, next){
    // var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var token = req.body.token;
    console.log(req.body);
    
    // decode token
    if (token) {
        // verifies secret and checks exp
        oauth2Client.verifyIdToken({idToken : req.body.token}).then((result)=>{
            console.log(result);
            res.send("ok");
            next();
        })
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
}
// process.env.PORT is relevant when you use Heroku as a host.
const PORT = 3000 | process.env.PORT;

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

//---- Setting up requesthandlers START ----//

app.get('/google-login', (req, res) => {

    res.send(`
        <h2>Login</h2>
        <a href="${authorizeUrl}">login</a>
    `)
})

app.get('/google/callback', (req, res) => {
    //Google will return an object that contains access_tokens amongst others
    //The accesstoken will be send back to google. Google will verify the accesstoken, 
    //and send back the userprofile.
    
    oauth2Client.getToken(req.query.code).then((result)=>{
        console.log(result);

        // oauth2Client.verifyIdToken({idToken : result.tokens.id_token}).then((result)=>{
        //     console.log(result);
        // })
res.send(result)
        // res.redirect(`http://localhost:4200/?token=${result.tokens.id_token}`);
    }).catch((err)=>{
        console.log(err);
    })
})

app.get('/privat', verifyToken ,(req, res)=>{
    res.send("private information")
})
//---- Setting up requesthandlers END ----//

//The app is instantiated and ready to go
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))