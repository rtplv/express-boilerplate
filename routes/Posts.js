const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controllers/AuthController');
const PostsController = require('../controllers/PostsController');

router.post('/posts/create', verifyToken, PostsController.create);
router.get('/posts/getAll', verifyToken, PostsController.getAll);

module.exports = router;
