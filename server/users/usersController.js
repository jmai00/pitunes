var url = require('url');
var utils = require('./usersUtils');
var utility = require('../utility');

var Promise = require('bluebird');

module.exports = {

  attachUser: function(req, res, next, user_id) {
    console.log('attaching user_id: ', user_id);
    req.user_id = user_id;
    next();
  },

  getUser: function(req, res, next) {
    var user_id = req.room_id;
    console.log('retrieving info for user_id:' + user_id);
    var R = Promise.promisify(utils.retrieveUser);
    R(user_id).then(function(user) {
      if (user) {
        res.json(user);
      } else {
        return next(new Error('user does not exist'));
      }
    })
    .catch(function(error) {
      return next(new Error('controller error: ', error));
    });
  },

  addUser: function(req, res, next) {
    console.log('adding user: ',req.body);
    var R = Promise.promisify(utils.storeUser);
    R(req.body).then(function(data) {
      if (data) {
        res.json(data);
      } else {
        res.status(500).end();
      }
    })
    .catch(function(error) {
      console.log('controller error: ',error);
    });
  },

  updateUser: function(req, res, next) {
    var user_id = req.room_id;
    var userInfo = req.body;

    console.log('updating user_id:', user_id, ' with info: ', userInfo );
    var R = Promise.promisify(utils.updateUser);
    R(user_id,userInfo).then(function(user) {
      if (user) {
        res.json(user);
      } else {
        res.status(500).end();
      }
    })
    .catch(function(error) {
      console.log('controller error: ',error);
    });
  },

  loginUser: function(req, res, next) {
    console.log('checking user: ',req.body);
    var R = Promise.promisify(utils.loginUser);
    R(req.body).then(function(data) {
      if (data) {
        utility.createSession(req, res, data);
        res.json(data);
      } else {
        res.status(500).end();
      }
    })
    .catch(function(error) {
      console.log('controller error: ',error);
      res.status(500).end();
    });
  },

  logoutUser: function(req, res, next) {
    req.session.destroy(function(){
      console.log('session destroyed');
        // res.redirect('/login');
      });
    res.status(200).end();
  },

  getAllUserPlaylists: function( req, res) {
    utils.retrieveAllUserPlaylists(req.user_id)
    .then(function(playlist) {
      res.json(playlist);
    });
  },

  addUserPlaylist: function( req, res) {

  }
};
