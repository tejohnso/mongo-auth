mongo-auth
==========

User authentication and CRUD routines for express.

To install:
npm install mongo-auth

NPM Dependencies:
   bcrypt 

Express dependencies:
   session handling with mongodb as the session store (eg: connect-session-mongo)   
   request.sessionStore should exist and should contain an object named _db    
   
To use:
   Pass a configuration object to mongo-auth otherwise defaults will be used.

```javascript
var auth = require('mongo-auth')({  "db": {  "collection": "users", 
                                             "userField": "name",
                                             "passField": "password"},

                                    "browser": {"userField": "userID",
                                                "passField": "password"},

                                    "response": {  "success": "success",
                                                   "failure": "invalid username or password",
                                                   "error": "auth error"},

                                    "bcryptCycles": 10
                                 });

app.post('/login', auth.checkLogin); //sets request.session.loggedin = [true/false]

      
app.get('/createTestUser', function(request, response) {
   auth.setUser(request.sessionStore, 'testuser', {"email": "test@test.com"}, function(err, user) {
      if (err) {console.log('error testing user:\n' + err); response.end('error'); return;}
      if (user === null) {response.end('user deleted'); return;}
      response.end(' user has been set\n' + JSON.stringify(user));
   });
});
```


API:
====

auth.checkLogin
-----------------
   Compares browser username and password against the configured mongodb collection.  If a match is found, request.session.loggedin is set to true and a browser response is sent back.
   
   If the options.response message begins with / then response.redirect(message) is called.   
   Otherwise response.end(message) is called. 
   
>For example if response.success = '/LoggedIn.html' then a successful login will redirect to '/LoggedIn.html'.   
If response.success = 'success' (default) then the browser will simply receive a 'success' message in plain text.   
This option is intended to be used with an AJAX call from the browser to the login url.   

   Internal errors will be logged to console - response will be a redirect or a plain text error message depending on options.response.error.
   

auth.setUser(store, user, fields, callback)
--------------------------
   Create a new user, modify fields for an existing user, or delete an existing user.   
   
   store - The session store (i.e. request.sessionStore - should contain _db)   
   user - The name of the target user   
   fields - null to delete the user, or an object containing the field names and values (eg: {"email": "me@localhost.com", "password": "secret"})   
   callback(err, user) - A callback that will be called after setUser attempts to complete its work.  
                        - err will contain an error message if an error ocurred otherwise null.   
                        - user will contain the new user document as an object, or null if the user was removed.    




