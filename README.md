mongo-auth
==========

log in/out routines for mongo web apps

requires bcrypt (npm install bcrypt) and session handling so that request.session is not null


var auth = require('mongo-auth')({  "collection": "users",                 
                                    "collectionUsernameField": "name",
                                    "collectionPasswordField": "password",
                                    "browserUsernameField": "userID",
                                    "browserPasswordField": "password",
                                    "success": "success",
                                    "failure": "invalid id or password"});


app.post('/login', auth.checkLogin);  //sets request.session.loggedin to true or false
