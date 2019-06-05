# Learning-Securing-Wepapi-with-oAuth-and-JSON-webtokens

#sources
- https://developers.google.com/identity/protocols/OAuth2
- http://www.oauth.net
- https://openid.net/connect/
- https://www.jsonwebtoken.io/

## Subjects

- oAuth (for authorization)
- OpenID connect (for authentication)
- Json Web Tokens (openID connect returns a token_id)   
- Http request interception (Angular intercepts )

## Learning path

- oAuth high abstraction
- Terminologies
- openID Connect
- Test with Postman and Google

#oAuth
## Sources
- https://oauth.net/
"oAuth is an open protocol to allow secure authorization in a simple and standard method from web, mobile, and desktop applications"

It is very important to distinguish between between authorization and autorization. 
Authorization is about granding roles access to specific ressources. Authentication is about verifying that a person is who he or she is saying that he or she is.

## oAuth flow
In this case the solution is based on a client-application, webserver-application and Google as an oAuth provider for authorization and authentication. 
### 1. Generate oAuth Link and expose it to the user
The client-application will need a button that allows for users to login with Google. Google provides a library google-auth-library (npm) that generates an url that points to the consent page.

![alt text](https://raw.githubusercontent.com/knoerregaard/Learning-Securing-Wepapi-with-oAuth-and-JSON-webtokens/master/public/oauthFlow_generate_oAuth_URL.PNG)

### 2. Open consent page
The user will click the button and get redirected to Google Consent Page.
![alt text](https://raw.githubusercontent.com/knoerregaard/Learning-Securing-Wepapi-with-oAuth-and-JSON-webtokens/master/public/oauthFlow_loginConsentPage.PNG)

### 3. Callback is made to the webserver appliccation
After the user has submittet email and password Google will make a callback to the callback-url. The callback-url is set in the application during oAuth setup at https://developers.google.com.

![alt text](https://raw.githubusercontent.com/knoerregaard/Learning-Securing-Wepapi-with-oAuth-and-JSON-webtokens/master/public/oauthFlow.PNG)

With the callback comes an access_token.
### 4. Exchange the access_token with a json web token.
The last step is to make another roundtrip to google an exchange the access_token with a json web token. 