const express = require('express');
const router = express.Router();
const licenciaController = require('../controllers/licenseController');

// Ruta para crear licencia (admin)
router.post('/crear', licenciaController.crearLicencia);

// Ruta para validar licencia (usuario)
router.post('/validar', licenciaController.validarLicencia);

// Ruta para ver estado de licencia por usuario
router.get('/estado/:userId', licenciaController.verEstadoLicencia);

module.exports = router;
