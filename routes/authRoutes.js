const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Ruta de login
router.post('/login', authController.login);
router.post("/registro", userController.createUsuario);
module.exports = router;