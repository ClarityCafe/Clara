var express = require('express')
  , config = require('./config')
  , Anime = require('./lib/anime')
  , notfound = require('./lib/notfound');

var app = express();
if ('test' !== app.get('env')) app.use(express.logger(config.get('logger:format')));
app.use(express.responseTime());
app.use(express.favicon());
app.use(express.json());

app.get('/v2/anime/:id', function(req, res, next) {
  res.type('application/json');

  var id = req.params.id;
  if (!/^\d+$/.test(id)) {
    return res.send(404, { 'error': 'not-found' });
  }

  Anime.byId(id, function(err, anime) {
    if (err) return next(err);
    res.send(anime);
  });
});

app.use(notfound());

app.listen(config.get('port'), function() {
  console.log('API server listening on port ' + config.get('port'));
});

module.exports = app;