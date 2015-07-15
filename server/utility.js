exports.isLoggedIn = function(req, res) {
  return req.session ? !! req.session.user : false;
};

exports.checkUserSession = function(req, res, next) {
  if (!exports.isLoggedIn(req)) {
    // res.redirect('#/');
    console.error('user not logged in');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() { //XXX check if this is async, currently programmed as sync
    req.session.user = newUser;
    // res.redirect('/');
  });
};

exports.errorLogger = function (error, req, res, next) {
  // log the error then send it to the next middleware in
  // middleware.js

  console.error(error.stack);
  next(error);
};

exports.errorHandler = function (error, req, res, next) {
  // send error message to client
  // message for gracefull error handling on app
  res.status(500).send({error: error.message});
};

