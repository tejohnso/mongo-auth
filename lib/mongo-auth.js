var bcrypt = require('bcrypt');
var mongoAuth = module.exports = function(options) {
   options = options || {};
   options.db.collection = options.db.collection || "users";
   options.db.userField = options.db.userField || "name";
   options.db.passField = options.db.passField || "name";
   options.browser.userField = options.browser.userField || "userID";
   options.browser.passField = options.browser.passField || "password";
   options.response.success = options.response.success || "success";
   options.response.failure = options.response.failure || "invalid username or password";
   options.bcryptCycles = options.bcryptCycles || 10;
   var collectionQuery = {};

   //Set up the response to redirect or send plain text for AJAX depending on options
   var respond = function(success, request, response) {
      if (success) {
         request.session.loggedin = true;
         if (options.response.success.indexOf('/') === 0) {
             response.redirect(options.response.success);
         } else {
            response.type('text/plain');
            response.end(options.response.success);
         }
      } else {
         request.session.loggedin = false;
         if (options.response.failure.indexOf('/') === 0) {
            response.redirect(options.response.failure);
         } else {
            response.type('text/plain');
            response.end(options.response.failure);
         }
      }
   };
         
//get the collection, get the user document, compare the password.
//set session variable loggedin to true or false.
//end with a text response to the browser
   var auth = {};
   auth.checkLogin = function(request, response) {
      request.sessionStore._db.collection(options.db.collection, function(err, coll) {
         if (err) {console.log('error fetching users collection\n' + err); return;}
         collectionQuery[options.db.userField] = request.body[options.browser.userField];
         coll.findOne(collectionQuery, function(err, doc) {
            if (err) {console.log('error fetching user document for ' + options.db.userField); return;}
            if (doc === null) {
               respond(false, request, response);
            } else {
               bcrypt.compare(request.body[options.browser.passField], doc[options.db.passField], function(err, match) {
                  if (err) {console.log('error comparing password '); return;}
                  if (match) {
                     respond(true, request, response);
                  } else {
                     respond(false, request, response);
                  }
               });
            }
         });
      });
   };
   return auth;
};
