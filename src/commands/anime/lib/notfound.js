module.exports = notfound;

function notfound(options) {
  var options = options || {};
  var body = options.body || { 'error': 'not-found' };

  return function(req, res, next) {
    if (res.body) return next();

    res.send(404, body);
  };
}