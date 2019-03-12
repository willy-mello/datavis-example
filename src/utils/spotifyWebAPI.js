const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = require('../.scrt.js/index.js')
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: CALLBACK_URL
})


module.exports = { spotifyApi }