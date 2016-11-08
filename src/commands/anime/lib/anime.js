var cheerio = require('cheerio')
  , request = require('request');

var Anime = (function() {
  function Anime() {}

  Anime.byId = function(id, callback) {
    request({
      url: 'http://myanimelist.net/anime/'+id,
      headers: { 'User-Agent': 'MyAnimeList Unofficial API (http://mal-api.com/)' },
      timeout: 3000
    }, function(err, response, body) {
      if (err) return callback(err);

      callback(null, body);
    });
  };

  return Anime;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Anime;
}