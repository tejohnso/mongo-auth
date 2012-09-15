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
   options.response.error = options.response.error || "auth error";
   options.bcryptCycles = options.bcryptCycles || 10;
   var collectionQuery = {};

   //Set up the response to redirect or send plain text for AJAX depending on options
   var respond = function(consoleErrorMessage, request, response, checkStatus) {
      var redirectOrEnd = function(text) {
         if (text.indexOf('/') === 0) {
            response.redirect(text);
         } else {
            response.type('text/plain');
            response.end(text);
         }
      };

      if (consoleErrorMessage) {
         console.log(consoleErrorMessage);
         redirectOrEnd(options.response.error);
         return;
      }
      if (checkStatus) {
         request.session.loggedin = true;
         redirectOrEnd(options.response.success);
      } else {
         request.session.loggedin = false;
         redirectOrEnd(options.response.failure);
      } 
   };
         
   //get the collection, get the user document, compare the password.
   //set session variable loggedin to true or false.

   var auth = {};
   auth.checkLogin = function(request, response) {
      request.sessionStore._db.collection(options.db.collection, function(err, coll) {
         if (err) {respond('auth error fetching users collection: ' + err, request, response); return;}
         collectionQuery = {};
         collectionQuery[options.db.userField] = request.body[options.browser.userField];
         coll.findOne(collectionQuery, function(err, doc) {
            if (err) {respond('auth error fetching user document for [' + options.db.userField + ']: ' + err, request, response); return;}
            if (doc === null) {
               respond(null, request, response, false);
            } else {
               bcrypt.compare(request.body[options.browser.passField], doc[options.db.passField], function(err, match) {
                  if (err) {respond('auth error comparing password: ' + err, request, response); return;}
                  if (match) {
                     respond(null, request, response, true);
                  } else {
                     respond(null, request, response, false);
                  }
               });
            }
         });
      });
   };

   auth.setUser = function(store, user, setVals, callback) {
      store._db.collection(options.db.collection, function(err, coll) {
         if (err) {if (callback) {callback('auth error setting user - bad collection: ' + err);} return;}
         collectionQuery = {};
         collectionQuery[options.db.userField] = user;
         if (setVals) {setVals[options.db.userField] = user;}
         coll.findAndModify(collectionQuery, {}, setVals, {"remove": (setVals === null), "upsert": (setVals !== null), "new":true}, function(err, newDoc){
            if (err) {if (callback) {callback('auth error setting user [' + user + ']: ' + err);} return;}
            if (callback) {callback(null, newDoc);}
         });
      });
   };

   return auth;
};
