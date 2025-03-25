const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de clientes
router.get("/", userController.getAllUser);
router.get("/create", userController.createUserForm);
router.post("/create", userController.createUser);
router.get("/edit/:id", userController.editUserForm);
router.post("/edit/:id", userController.editUser);
router.get("/delete/:id", userController.deleteUser);

module.exports = router;