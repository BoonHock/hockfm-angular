function youtube_master() {
  // this is actually, youtube's script (https://www.youtube.com/iframe_api)
  // put here in function for easier control
  var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/24c6f8bd\/www-widgetapi.vflset\/www-widgetapi.js';
  try {
    var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
      createScriptURL: function (x) {
        return x
      }
    });
    scriptUrl = ttPolicy.createScriptURL(scriptUrl)
  } catch (e) { }
  var YT = {
    loading: 0,
    loaded: 0
  };
  var YTConfig = {
    "host": "https://www.youtube.com"
  };
  if (!YT.loading) {
    YT.loading = 1;
    (function () {
      var l = [];
      YT.ready = function (f) {
        if (YT.loaded) f();
        else l.push(f)
      };
      window.onYTReady = function () {
        YT.loaded = 1;
        for (var i = 0; i < l.length; i++) try {
          l[i]()
        } catch (e$0) { }
      };
      YT.setConfig = function (c) {
        for (var k in c)
          if (c.hasOwnProperty(k)) YTConfig[k] = c[k]
      };
      var a = document.createElement("script");
      a.type = "text/javascript";
      a.id = "www-widgetapi-script";
      a.src = scriptUrl;
      a.async = true;
      var c = document.currentScript;
      if (c) {
        var n = c.nonce || c.getAttribute("nonce");
        if (n) a.setAttribute("nonce", n)
      }
      var b =
        document.getElementsByTagName("script")[0];
      b.parentNode.insertBefore(a, b)
    })()
  };
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    playerVars: {
      // 'playsinline': 1
      listType: 'playlist',
      list: playlistId
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// // autoplay video
function onPlayerReady(event) {
  event.target.playVideo();
}

// // when video ends
function onPlayerStateChange(event) {
  // if (event.data === YT.PlayerState.BUFFERING && player.getPlaylistIndex() != yt_playlist_index) {
  // 	yt_playlist_index = player.getPlaylistIndex();
  // 	player.pauseVideo();
  // 	continue_youtube = true;
  // 	play_next();
  // }
}
