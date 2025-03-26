const companias = require('../models/companiaModel');
const Tablas = require('../models/tablasModel');

exports.createCompaniaForm = (req, res) => {
  const userid = req.cookies.userid;
  Tablas.rubros((err, rubros) => {
    if (err) {
      return res.status(500).send("Error al obtener categorias");
    }
    Tablas.rubrosh((err, rubrosh) => {
      if (err) {
        return res.status(500).send("Error al obtener categorias");
      }
      //console.log(rubros);
      //console.log(rubrosh);
      res.render('usuarios/registroCia', { layout: 'layouts/layoutLog', rubros, rubrosh, userid });
    });

  });
};

exports.createCompaniaReg = (req, res) => {
  const { iduser } = req.params;
  const { nombre, documento, telefono, direccion, email, indimp, mtoimp, idrub, fechavig, tipovig, diasvig, indprd, indser, estado } = req.body;
  const compania = { nombre, documento, telefono, direccion, email, indimp, mtoimp, idrub, tipovig, fechavig, diasvig, indprd, indser, estado };
  console.log(iduser);
  console.log(req.body);

  compania.indprd = req.body.indprd ? "1" : "0";
  compania.indser = req.body.indser ? "1" : "0";
  const fechaHoy = new Date();
  compania.fechavig = fechaHoy.toISOString().split('T')[0];
  compania.diasvig = 30;
  compania.estado = 1;
  //console.log(compania);
  companias.create(compania, (err, results) => {
    if (err) {
      return res.status(500).send("Error al crear compañia");
    }
    const idcia = results.insertId;
    console.log(idcia);
    companias.updateUserCia(idcia, iduser, (err, results) => {
      if (err) {
        return res.status(500).send("Error al actulizar al usuario");
      }
      res.redirect("/");
    });
  });
};

exports.createCompaniaFormConfig = (req, res) => {
  Tablas.rubros((err, rubros) => {
    if (err) {
      return res.status(500).send("Error al obtener categorias");
    }
    Tablas.rubrosh((err, rubrosh) => {
      if (err) {
        return res.status(500).send("Error al obtener categorias");
      }
      //console.log(rubros);
      //console.log(rubrosh);
      res.render('configura/create', { rubros, rubrosh });
    });
  });
};

exports.createCompania = (req, res) => {
  const { nombre, documento, telefono, direccion, email, imagen, indimp, mtoimp, idrub, cantusu, tipovig, fechavig, diasvig, indprd, indser, estado, pagweb, facebook, instagram, linkedid } = req.body;
  const compania = { nombre, documento, telefono, direccion, email, imagen, indimp, mtoimp, idrub, cantusu, tipovig, fechavig, diasvig, indprd, indser, estado, pagweb, facebook, instagram, linkedid };

  compania.estados = 1;

  companias.create(compania, (err) => {
    if (err) {
      return res.status(500).send("Error al crear cliente");
    }
    res.redirect("/clientes");
  });
};

exports.editCompaniaForm = (req, res) => {
  //const { id } = req.params;
  //const id  = res.locals.idcia;
  console.log(res.locals.idcia);
  companias.getById(res.locals.idcia, (err, compania) => {
    if (err) {
      return res.status(500).send("Error al obtener el compania");
    }
    compania = compania || [];
    if (compania.length == 0) {
      console.log("no hay6 datos");
      //return res.status(500).send("Error al obtener el compania");
      Tablas.rubros((err, rubros) => {
        if (err) {
          return res.status(500).send("Error al obtener rubros");
        }
        Tablas.rubrosh((err, rubrosh) => {
          if (err) {
            return res.status(500).send("Error al obtener rubros");
          }
          const tipovig = [
            { id: 'A', nombre: "Anual" },
            { id: 'M', nombre: "Mensual" },
            { id: 'P', nombre: "Prueba 30 días" }
          ];

          return res.render('configura/edit', { compania, tipovig, rubros, rubrosh, fechavigform: "", fechavigTerform: "", mensaje: "Error al obtener la compañia", tipo: "error" });
        });
      });
    }
    else {
      const fecha = new Date(compania.fechavig);
      //const fecha = new Date('2025-03-14');
      const fechaini = fecha.toISOString().split('T')[0];
      compania.fechavig = fechaini;
      compania.estado = 1;
      var fechafin = "";
      // console.log(compania);
      if (compania.tipovig == 'A') {
        fechafin = fecha.setFullYear(fecha.getFullYear() + 1);
      } else if (compania.tipovig == 'P') {
        fechafin = fecha.setMonth(fecha.getMonth() + 1);
      } else {
        fechafin = fecha.setMonth(fecha.getMonth() + 1);
      }

      const fechaT = new Date(fechafin);
      fechafin = fechaT.toISOString().split('T')[0];
      console.log(fechafin);
      console.log(compania);
      Tablas.rubros((err, rubros) => {
        if (err) {
          return res.status(500).send("Error al obtener rubros");
        }
        Tablas.rubrosh((err, rubrosh) => {
          if (err) {
            return res.status(500).send("Error al obtener rubros");
          }
          //console.log(rubros);
          //console.log(rubrosh);

          const tipovig = [
            { id: 'A', nombre: "Anual" },
            { id: 'M', nombre: "Mensual" },
            { id: 'P', nombre: "Prueba 30 días" }
          ];

          res.render('configura/edit', { compania, tipovig, rubros, rubrosh, fechavigform: fechaini, fechavigTerform: fechafin, mensaje: "", tipo: "" });
        });
      });
    }
  });
};

exports.editCompania = (req, res) => {
  //const { id } = req.params;
  console.log("entra en editCompania");
  console.log(req.body);
  console.log(res.locals.idcia);
  const { nombre, documento, telefono, direccion, email, imagen, indimp, mtoimp, idrub, cantusu, tipovig, diasvig, indprd, indser, estado, pagweb, facebook, instagram, linkedid, imagen_u } = req.body;
  let imagenUrl = null;
  
  // Si se ha subido una nueva imagen, almacenamos la URL
  if (req.file) {
    console.log('entra en req.file' + req.file.filename);
    imagenUrl = '/uploads/' + req.file.filename;
  }
  else{
    imagenUrl = imagen_u;
  }

  const compania = { nombre, documento, telefono, direccion, email, imagen, indimp, mtoimp, idrub, cantusu, tipovig, diasvig, indprd, indser, estado, pagweb, facebook, instagram, linkedid };

  compania.indprd = req.body.indprd ? "1" : "0";
  compania.indser = req.body.indser ? "1" : "0";
  compania.mtoimp = req.body.mtoimp ? req.body.mtoimp : "0";
  compania.diasvig = 30;
  compania.estado = 1;
  compania.imagen = imagenUrl;
  companias.update(res.locals.idcia, compania, (err) => {
    if (err) {
      console.log('Error al actualizar compania' + err);
      return res.status(500).send("Error al actualizar compania");
    }
    companias.getById(res.locals.idcia, (err, compania) => {
      if (err) {
        return res.status(500).send("Error al obtener el compania");
      }
      const fecha = new Date(compania.fechavig);
      const fechaini = fecha.toISOString().split('T')[0];
      compania.fechavig = fechaini;
      compania.estado = 1;
      var fechafin = "";
      // console.log(compania);
      if (compania.tipovig == 'A') {
        fechafin = fecha.setFullYear(fecha.getFullYear() + 1);
      } else if (compania.tipovig == 'P') {
        fechafin = fecha.setMonth(fecha.getMonth() + 1);
      } else {
        fechafin = fecha.setMonth(fecha.getMonth() + 1);
      }

      const fechaT = new Date(fechafin);
      fechafin = fechaT.toISOString().split('T')[0];
      console.log(fechafin);
      console.log(compania);
      Tablas.rubros((err, rubros) => {
        if (err) {
          return res.status(500).send("Error al obtener rubros");
        }
        Tablas.rubrosh((err, rubrosh) => {
          if (err) {
            return res.status(500).send("Error al obtener rubros");
          }
          //console.log(rubros);
          //console.log(rubrosh);

          const tipovig = [
            { id: 'A', nombre: "Anual" },
            { id: 'M', nombre: "Mensual" },
            { id: 'P', nombre: "Prueba 30 días" }
          ];

          res.render('configura/edit', { compania, tipovig, rubros, rubrosh, fechavigform: fechaini, fechavigTerform: fechafin, mensaje: "Guardado correctamente", tipo: "success" });
        });
      });
    });
  });
};