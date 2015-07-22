var db = require('../db/schema');
var Playlists = require('../db/collections/playlists');
var Playlist = require('../db/models/playlist');

module.exports = {

  //get a playlist from DB by ID
  retrievePlaylist: function(playlist_id, callback) {
    playlist_id = parseInt(playlist_id);

    new Playlist({
        id: playlist_id,
      })
      .retrievePlaylist()
      // .fetch({
      //   //add related data we would like to return in the withRelated array
      //   withRelated: ['medias'],
      //   require: true
      // })
      .then(function(found) {
        if (found) {
          // var playlistWithJoins = cleanAttributes(found.attributes);

          // this is an example of how to add related data to the response object
          // playlistWithJoins.events = [];
          // found.relations.events.forEach(function(item) {
          //    playlistWithJoins.events.push(cleanAttributes(item.attributes));
          // });

          callback(null, found);
        } else {
          console.log('playlist_id not found:' + playlist_id);
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  },

  //update a playlist in DB by ID
  updatePlaylist: function(playlist_id, playlistInfo, callback) {
    playlist_id = parseInt(playlist_id);
    new Playlist({id: playlist_id})
      .fetch().then(function(found) {
        if (found) {
            //found.set(playlistInfo);
            var dbPlaylist = [];
            playlistInfo.map(function(media, index) {
              var file = new Media({youtube_id: media});

              file.fetch().
                then(function(found) {
                  if (found) {
                    dbPlaylist.push({playlist_id: playlist_id, media_id: found.id, media_order: index+1});
                  }
                  else {
                    file.save().then(function(media) {
                      dbPlaylist.push({playlist_id: playlist_id, media_id: media.id, media_order: index+1});
                    });
                  }
                });
            });
          found.set(dbPlaylist);  

          found.save().then(function(updatedPlaylist) {
              callback(null, updatedPlaylist);
            })
            .catch(function(error) {
              console.log('error:', error);
            });
        } else {
          console.log('playlist_id not found:' + playlist_id);
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  },

  //store a new playlist in DB
  storePlaylist: function(playlist, callback) {
    var playlistName = playlist.name;
    var user_id = playlist.user_id;

    new Playlist({
        name: playlistName
      }).fetch().then(function(found) {

        if (found) {
          callback(null, found.attributes);
          console.log('playlist already found:', playlistName);

        } else {

          var playlist = new Playlist({
            name: playlistName,
            user_id: user_id

          });

          playlist.save().then(function(newPlaylist) {
              new Playlists().add(newPlaylist);
              callback(null, newPlaylist);
            })
            .catch(function(error) {
              console.log('error:', error);
            });
        }
      })
      .catch(function(error) {
        console.log('error:', error);
      });
  }
};
