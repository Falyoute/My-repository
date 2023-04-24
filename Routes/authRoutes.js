const { Router } = require('express');
const authController = require('../controllers/authControllers');
const { isConnected } = require('../Middlewares/isConnected');

const router = Router();

router.get('/register', authController.register_get);
router.post('/register', authController.register_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/users' , isConnected, authController.getUsers);

module.exports = router;