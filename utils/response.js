const cookiesHelper = require('./cookies');

/**
 * Success response
 */
exports.success = (res, resData) =>
  res.status(200).send({
    success: true,
    ...resData,
  });

/**
 * Errors handlers
 */
exports.errors = {
  // Client error's
  unauthorized(res) {
    cookiesHelper.clearTokens(res);
    return res.status(401).send({
      success: false,
      errorMsg: 'User is not authorized.',
    });
  },
  badRequest(res, errorMsg) {
    return res.status(400).send({
      success: false,
      errorMsg,
    });
  },
  forbidden(res) {
    cookiesHelper.clearTokens(res);
    return res.status(403).send({
      success: false,
      errorMsg: 'Access to the resource is prohibited.',
    });
  },
  notFound(res) {
    return res.status(404).send({
      success: false,
      errorMsg: 'Not found.',
    });
  },
  // Server error's
  internalError(res, error) {
    return res.status(500).send({
      success: false,
      errorMsg: 'Internal server error.',
      debug: error,
    });
  },
};

exports.redirect = {
  withLogout(res) {
    cookiesHelper.clearTokens(res);
    return res.redirect('/auth/login');
  },
};
