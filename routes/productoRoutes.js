const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas de productos
router.get("/", productoController.getAllPoductos);
router.get("/create", productoController.createProductoForm);
//router.post("/create", productoController.createProducto);
router.get("/edit/:id", productoController.editProductoForm);
//router.post("/edit/:id", productoController.editProducto);
router.get("/delete/:id", productoController.deleteProducto);

module.exports = (upload) => {
    // Pasa 'upload' como middleware para manejar la subida de archivos
    router.post('/create', upload.single('imagen'), productoController.createProducto);
    router.post('/edit/:id', upload.single('imagen'), productoController.editProducto);
    return router;
  };
