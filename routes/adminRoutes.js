const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/licencias', adminController.vistaPanelLicencias);
router.post('/licencias/desactivar/:id', adminController.desactivarLicencia);
router.post('/licencias/renovar/:id', adminController.renovarLicencia);

module.exports = router;
