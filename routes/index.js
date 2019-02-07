/**
 * Apply all exists routes to app
 * @param app
 */
exports.applyTo = app => {
  app.use('/api', require('./Auth'));
  app.use('/api', require('./Posts'));
};
