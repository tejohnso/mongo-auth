mongo-auth
==========

log in/out routines for mongo web apps

To install:
npm install mongo-auth

requires bcrypt (npm install bcrypt) and session handling so that request.session is not null

To use:
```javascript
var auth = require('mongo-auth')({  "collection": "users",                 
                                    "collectionUsernameField": "name",
                                    "collectionPasswordField": "password",
                                    "browserUsernameField": "userID",
                                    "browserPasswordField": "password",
                                    "success": "success",
                                    "failure": "invalid id or password"});

app.post('/login', auth.checkLogin);  //request.session.loggedin will be set to true or false
```
