const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** Authorization Middleware: Requires user is logged in. */

function requireLogin(req, res, next) {
    try {
      if (req.curr_username) {
        return next();
      } else {
        return next({ status: 401, message: 'Unauthorized' });
      }
    } catch (err) {
      return next(err);
    }
  }
  
  function authUser(req, res, next) {
    try {
      const token = req.body.token || req.query.token;
      if (token) {
        let payload = jwt.verify(token);
        req.curr_username = payload.username;
      }
      return next();
    } catch (err) {
      err.status = 401;
      return next(err);
    }
  }
  module.exports = {
    requireLogin,
    authUser
  };