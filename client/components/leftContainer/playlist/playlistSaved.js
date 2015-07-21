var placeholder = document.createElement("div");
placeholder.className = "placeholder";

var List = React.createClass({
  getInitialState: function () {
    return { data: this.props.data };
  },
  onClick: function (e) {
    console.log(e.currentTarget.lastChild);
  },
  dragStart: function (e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  },
  dragEnd: function () {
    this.dragged.style.display = "block";
    this.dragged.parentNode.removeChild(placeholder);

    // Update data
    var data = this.state.data;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if (from < to) to--;
    if (this.nodePlacement === "after") to++;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({data: data});
  },

  dragOver: function (e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    if (e.target.className === "placeholder") return;
    this.over = e.target;
    // Inside the dragOver method
    var relY = e.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    var parent = e.target.parentNode;
    
    if (relY > height) {
      this.nodePlacement = "after";
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    } else if (relY < height) {
      this.nodePlacement = "before";
      parent.insertBefore(placeholder, e.target);
    }
  },
  render: function () {
    var style = {
      cursor: 'pointer',
      padding: '0',
      margin: '0 0 0 10px',
      color: '#FFFFFF',
      listStyleType: 'none'
    };
    var listItems = this.state.data.map((function (item, i) {
      return (
        <div style={style} data-id={i}
            key={i}
            draggable="true"
            onDragEnd={this.dragEnd}
            onDragStart={this.dragStart}
            onClick={this.onClick}>
          {item}
        </div>
      );
    }).bind(this));

    return (
      <div onDragOver={this.dragOver}>{listItems}</div>
    );
  }
});

//list of dummy user data
var currentUser = {
  currentPlaylist: {
    title: 'Test Playlist',
    songs: [
      {
        img: 'https://i.ytimg.com/vi/2HQaBWziYvY/default.jpg',
        title: 'Darude - Sandstorm',
        id: '2HQaBWziYvY',
        duration: 224,
        durationDisplay: '03:44'
      },
      {
        img: 'https://i.ytimg.com/vi/59CZt1xsh5s/default.jpg',
        title: 'The Growlers - One Million Lovers',
        id: '59CZt1xsh5s',
        duration: 278,
        durationDisplay: '04:38'
      },
      {
        img: 'https://i.ytimg.com/vi/BYbJmQj5VkE/default.jpg',
        title: 'FIDLAR - No Waves (Music Video)',
        id: 'BYbJmQj5VkE',
        duration: 190,
        durationDisplay: '03:10'
      }
    ]
  }
};


//take the songs from the user data
var arrSongs = [];
var populatePlaylist = function() {
  arrSongs = [];
  for (var song in currentUser.currentPlaylist.songs) {
    arrSongs.push([currentUser.currentPlaylist.songs[song].title + ' | ' + currentUser.currentPlaylist.songs[song].durationDisplay]);
  }
};

populatePlaylist();

var addSongToPlaylist = function (songNode) {
  currentUser.currentPlaylist.songs.push(songNode);
  console.log("Added ", songNode, " to playlist");
  populatePlaylist();
}

var Songs = React.createClass({
  render: function() {
    return (
      <List data={arrSongs} /> 
    );
  }
});

var PlaylistTitle = React.createClass({
  render: function(){
    var style = {
      textAlign: 'center',
      color: 'white',
      marginTop: '10px',
      paddingBottom: '10px',
      borderBottom: '2px solid #444444'
    };
    return (
      <h4 style={style}>{currentUser.currentPlaylist.title}</h4>
    );
  }
});

var PlaylistSaved = React.createClass({
  render: function() {
    var style = {
      background: '#222222',
      border: '2px solid #444444',
      position: 'absolute', 
      width: '100%',
      height: '50%',
      overflow: 'auto',
      textAlign: 'left',
      bottom: '0'
    };
    return (
      <div style={style}>
        <PlaylistTitle />
        <Songs />
      </div>
    );
  }
});