const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);

module.exports = router;
