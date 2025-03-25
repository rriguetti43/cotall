// /routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const companiaController = require('../controllers/companiaController');

//registro desde el form de Inicio
router.get("/registroCia", companiaController.createCompaniaForm);
router.post("/createregistroCia/:iduser", companiaController.createCompaniaReg);

//registro desde el form de APP
router.get("/create", companiaController.createCompaniaFormConfig);
//router.post("/create", companiaController.createCompaniaForm);
router.get("/edit", companiaController.editCompaniaForm);
//router.post("/edit", companiaController.editCompania);
//router.get("/delete/:id", clienteController.deleteCliente);

//module.exports = router;
module.exports = (upload) => {
    // Pasa 'upload' como middleware para manejar la subida de archivos
    router.post('/edit', upload.single('imagen'), companiaController.editCompania);
    return router;
  };
