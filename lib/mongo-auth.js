var bcrypt = require('bcrypt');
var mongoAuth = module.exports = function(options) {
   options = options || {};
   options.collection = options.collection || "users";
   options.collectionUsernameField = options.collectionUsernameField || "name";
   options.collectionPasswordField = options.collectionPasswordField || "name";
   options.browserUsernameField = options.browserUsernameField || "userID";
   options.browserPasswordField = options.browserPasswordField || "password";
   options.success = options.success || "success";
   options.failure = options.failure || "failure";
   var collectionQuery = {};

//get the collection, get the user document, compare the password.
//set session variable loggedin to true or false.
//end with a text response to the browser
   var auth = {};
   auth.checkLogin = function(request, response) {
      response.type('text/plain');
      request.sessionStore._db.collection(options.collection, function(err, coll) {
         if (err) {console.log('error fetching users collection');}
         collectionQuery[options.collectionUsernameField] = request.body[options.browserUsernameField];
         coll.findOne(collectionQuery, function(err, doc) {
            if (err) {console.log('error fetching user document for ' + options.collectionUsernameField);}
            if (doc === null) {
               response.end('invalid id or password');
            } else {
               bcrypt.compare(request.body[options.browserPasswordField], doc[options.collectionPasswordField], function(err, match) {
                  if (err) {console.log('error comparing password ');}
                  if (match) {
                     request.session.loggedin = true;
                     response.end(options.success);
                  } else {
                     response.end(options.failure);
                  }
               });
            }
         });
      });
   };
   return auth;
};
