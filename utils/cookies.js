const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  /**
   * Set auth tokens
   * @param {*} res
   * @param {Array} tokens
   */
  setTokens(res, tokens) {
    res.cookie('auth_access', tokens.accessToken, { secure: !isDev });
    res.cookie('auth_refresh', tokens.refreshToken, { secure: !isDev });
  },
  /**
   * Clear auth tokens on client
   * @param {*} res
   */
  clearTokens(res) {
    res.clearCookie('auth_access', { secure: !isDev });
    res.clearCookie('auth_refresh', { secure: !isDev });
  },
};
