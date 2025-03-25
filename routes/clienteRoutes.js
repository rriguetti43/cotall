// /routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rutas de clientes
router.get("/", clienteController.getAllClientes);
router.get("/create", clienteController.createClienteForm);
router.post("/create", clienteController.createCliente);
router.get("/edit/:id", clienteController.editClienteForm);
router.post("/edit/:id", clienteController.editCliente);
router.get("/delete/:id", clienteController.deleteCliente);

module.exports = router;
