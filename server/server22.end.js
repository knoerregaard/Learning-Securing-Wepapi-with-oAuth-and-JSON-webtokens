const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

function verifyToken(req, res, next){
    let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4ZjU4MTNlMzI3YWQxNGNhYWYxYmYyYTEyMzY4NTg3ZTg4MmI2MDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5NzY0ODk3MTY2NDUtNW9pcTNiMjNyNzhkam85ZGVpaTR1aHNxZjc0YzFpNXMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NzY0ODk3MTY2NDUtNW9pcTNiMjNyNzhkam85ZGVpaTR1aHNxZjc0YzFpNXMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDIxMTIyMDYyODEwMDQzNzIyMjEiLCJhdF9oYXNoIjoid21pa1ZjbXEwOGhGTmMwbWJTY2JCQSIsIm5hbWUiOiJLbGF1cyBOw7hycmVnYWFyZCIsInBpY3R1cmUiOiJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLXlhWWk0VWJoVnhRL0FBQUFBQUFBQUFJL0FBQUFBQUFBRFlzLzFkMUJvTjFhTmNRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJLbGF1cyIsImZhbWlseV9uYW1lIjoiTsO4cnJlZ2FhcmQiLCJsb2NhbGUiOiJkYSIsImlhdCI6MTU1Nzg2MjAyNCwiZXhwIjoxNTU3ODY1NjI0fQ.e0qkcyuuPjnriA7WLPYm3DbiI8aJyRerzMC2TlcIoezS0Wt9mhF1UzNhsf80KDm6ZzQeR2IBB2V1czHM1bji8l7jtrHZssMdasmaAhprVG1GF8Gcg3rJXh5eqEA68RmsVvjsyldQNZDEFcerFf5DW7OHxwc8Xr6RQaPJrqUaY92zJfUBRGbMYOvKvn75D87YnsCf3DPYINvVjHBVkEO8u-l1ih88nmcjWgnPcXUVUsrt6FOaz4y6jfkCHRYQdb1crkZLYBevqZO4TntNpjwjuqa07_CiUU4kfe72KcPa0BjctWnK4Zjb-36d3347REeRGgeGSuBNXrY_kBcNUWMjmQ";
    oauth2Client.verifyIdToken({idToken : token}).then((result)=>{
        // console.log("After verification");
        console.log(result);
        
    }).catch((err)=>{
        console.log(err);
        
    });
    next();
}

app.get('/google-login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <a href="${authorizeUrl}">login</a>
    `)
})
app.get('/google/callback', verifyToken, (req, res) => {
    //Google will return an object that contains access_tokens amongst others
    //The accesstoken will be send back to google. Google will verify the accesstoken, 
    //and send back the userprofile.
    console.log("in the callback");
    
    
    oauth2Client.getToken(req.query.code).then((result)=>{
        //The result keeps the token
        // console.log(result);
        // console.log(result.tokens.id_token);
        
        // oauth2Client.verifyIdToken({idToken : result.tokens.id_token}).then((result)=>{
        //     console.log(result);
            
        // })
    //   console.log(result.tokens.id_token);

        // console.log(jwt.verify(result.tokens.id_token, 'F64sonuPGM5yqEw8v-SvqWZv',{format: 'PKCS8', algorithms: ['HS256'], ignoreExpiration: true }));
    }).catch((err)=>{
        console.log(err);
        
    })  
    res.send("ok")
})

//---- Setting up requesthandlers END ----//

//The app is instantiated and ready to go
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
