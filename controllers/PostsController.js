const responseHelper = require('../utils/response');

const Post = require('../models/Posts/Post');

/**
 * Get all posts
 * @param req
 * @param res
 */
module.exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find({});
    return responseHelper.success(res, posts);
  } catch (err) {
    return responseHelper.errors.internalError(res, err);
  }
};

/**
 * Get all posts
 * @param req
 * @param res
 */
module.exports.create = async (req, res) => {
  const { title, posterUrl, content, tags } = req.body;

  if (!title || !posterUrl || !content || !tags || !tags.length) {
    return responseHelper.errors.badRequest(
      res,
      'Необходимо заполнить все обязательные поля',
    );
  }

  try {
    const post = await Post.create({ title, posterUrl, content, tags });

    await post.save();

    return responseHelper.success(res, post);
  } catch (err) {
    return responseHelper.errors.internalError(res, err);
  }
};
