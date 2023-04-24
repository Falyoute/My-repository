const jwt = require('jsonwebtoken');

const isConnected = (req, res, next) => {
  const token = req.cookies.jwt;

  // vérifier que jwt existe et est vérifié
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = { isConnected };