exports.captcha = function(req, res, next) {
    var c = require('captchagen');
    captcha = c.create();
    req.session.captcha = captcha.text();
    captcha.generate();
    res.type('image/png');
    res.end(captcha.buffer());
  };