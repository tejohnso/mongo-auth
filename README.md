mongo-auth
==========

User authentication and CRUD routines for express.

To install:
npm install mongo-auth

NPM Dependencies:
   bcrypt 

Express dependencies:
   session handling with mongodb as the session store (eg: connect-session-mongo)
   request.session should exist and should contain a _db object
   
To use:
   Pass a configureation object to mongo-auth otherwise defaults will be used.

```javascript
var auth = require('mongo-auth')({  "db": {  "collection": "users", 
                                             "userField": "name",
                                             "passField": "password"},

                                    "browser": {"userField": "userID",
                                                "passField": "password"},

                                    "response": {  "success": "success",
                                                   "failure": "invalid username or password"},

                                    "bcryptCycles": 10
                                 });

app.post('/login', auth.checkLogin);
```


API:

auth.checkLogin
   Compares browser username and password against the configured mongodb collection.
   If a match is found, request.session.loggedin is set to true and a browser response is sent back.
   If the options.response message begins with / then response.redirect(message) is called.
   Otherwise response.end(message) is called. 
      For example if response.success = '/LoggedIn.html' then a successful login will redirect to '/LoggedIn.html'.
      If response.success = 'success' (default) then the browser will simply receive a 'success' message in plain text.
      This option is intended to be used with an AJAX call from the browser to the login url.

***   Perhaps the response options should be removed and instead have this 
***   functionality supplied to auth in a user supplied callback.

auth.setUser(user, fields)  //pass null to delete user, otherwise sets user fields

***   Not yet implemented
