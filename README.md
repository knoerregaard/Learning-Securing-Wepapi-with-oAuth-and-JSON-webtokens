# Learning-Securing-Wepapi-with-oAuth-and-JSON-webtokens

## Sources
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
The last step is to make another roundtrip to google to convert the access_token to an id token (Json web token). The id token is a "thing" in the OpenID Connect Protocol. The id token is a token issued as a result of a user authentication. So if google verifies the Access_token Google will return an id token. 

Here is an example of an ID token
```
eyJraWQiOiIxZTlnZGs3IiwiYWxnIjoiUlMyNTYifQ.ewogImlzcyI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZfV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5NzAsCiAibmFtZSI6ICJKYW5lIERvZSIsCiAiZ2l2ZW5fbmFtZSI6ICJKYW5lIiwKICJmYW1pbHlfbmFtZSI6ICJEb2UiLAogImdlbmRlciI6ICJmZW1hbGUiLAogImJpcnRoZGF0ZSI6ICIwMDAwLTEwLTMxIiwKICJlbWFpbCI6ICJqYW5lZG9lQGV4YW1wbGUuY29tIiwKICJwaWN0dXJlIjogImh0dHA6Ly9leGFtcGxlLmNvbS9qYW5lZG9lL21lLmpwZyIKfQ.rHQjEmBqn9Jre0OLykYNnspA10Qql2rvx4FsD00jwlB0Sym4NzpgvPKsDjn_wMkHxcp6CilPcoKrWHcipR2iAjzLvDNAReF97zoJqq880ZD1bwY82JDauCXELVR9O6_B0w3K-E7yM2macAAgNCUwtik6SjoSUZRcf-O5lygIyLENx882p6MtmwaL1hd6qn5RZOQ0TLrOYu0532g9Exxcm-ChymrB4xLykpDj3lUivJt63eEGGN6DH5K6o33TcxkIjNrCD4XB1CKKumZvCedgHHF3IAK4dVEDSUoGlH9z4pP_eWYNXvqQOjGs-rDaQzUHl6cQQWNiDpWOl_lxXjQEvQ
```
This string of characters conforms to the JSON web token standard (RFC 7519). It consist of a header, a payload and a signature. To understand the token in depth please refere to this artciel: https://medium.com/@darutk/understanding-id-token-5f83f50fa02e.
