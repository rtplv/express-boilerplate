const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/Auth/User');

const responseHelper = require('../utils/response');
const cookiesHelper = require('../utils/cookies');
const jwtHelper = require('../utils/jwt');

/**
 * Login user
 * @param req
 * @param res
 */
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return responseHelper.errors.badRequest(
      res,
      'Необходимо указать логин и пароль',
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return responseHelper.errors.badRequest(
        res,
        'Пользователь не найден. Проверьте введенные данные',
      );
    }

    const isCorrectPass = await bcrypt.compare(
      req.body.password,
      user.hashPassword,
    );

    if (isCorrectPass) {
      const tokens = jwtHelper.generateAuthTokens(user);
      user.refreshToken = tokens.refreshToken;

      await user.save();

      cookiesHelper.setTokens(res, tokens);

      return responseHelper.success(res, { tokens });
    }

    return responseHelper.errors.badRequest(
      res,
      'Пользователь не найден. Проверьте введенные данные',
    );
  } catch (err) {
    return responseHelper.errors.internalError(res, err);
  }
};

/**
 * Checks user authorization (middleware)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.verifyToken = async (req, res, next) => {
  // Check request from ajax or origin
  const redirectMethod = req.xhr
    ? responseHelper.errors.forbidden
    : responseHelper.redirect.withLogout;

  try {
    if (req.cookies && req.cookies.auth_access) {
      const secret = process.env.JWT_SECRET_KEY;

      req.user = jwt.verify(req.cookies.auth_access, secret);

      return next();
    } else {
      req.user = undefined;
      return redirectMethod(res);
    }
  } catch (err) {
    if (req.cookies.auth_refresh) {
      try {
        const secret = process.env.JWT_SECRET_KEY;
        const user = User.findOne({ refreshToken: req.cookies.auth_refresh });

        if (!user) return redirectMethod(res);

        const decode = jwt.verify(req.cookies.auth_refresh, secret);
        const tokens = jwtHelper.generateAuthTokens(user);

        // Save token to user
        user.refreshToken = tokens.refreshToken;

        cookiesHelper.setTokens(res, tokens);

        await user.save();

        req.user = decode;
        return next();
      } catch (err) {
        return redirectMethod(res);
      }
    } else {
      return redirectMethod(res);
    }
  }
};

/**
 * Register user
 * @param {*} req
 * @param {*} res
 */
module.exports.logout = async (req, res) => {
  try {
    if (req.cookies && req.cookies.auth_refresh) {
      const user = await User.findOne({
        refreshToken: req.cookies.auth_refresh,
      });

      if (!user) return responseHelper.errors.unauthorized(res);

      user.refreshToken = '';

      await user.save();

      res.clearCookie('auth_access');
      res.clearCookie('auth_refresh');

      return responseHelper.success(res);
    } else {
      return responseHelper.errors.unauthorized(res);
    }
  } catch (err) {
    return responseHelper.errors.internalError(res, err);
  }
};
