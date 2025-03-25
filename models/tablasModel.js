const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Tablas {
    static Categorias(callback) {
      db.query("SELECT * FROM categorias", (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }

    static Marcas(callback) {
        db.query("SELECT * FROM marcas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

    static Documentos(callback) {
        db.query("SELECT * FROM documentos", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Monedas(callback) {
        db.query("SELECT * FROM monedas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Formapago(callback) {
        db.query("SELECT * FROM formapagos", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Formaentrega(callback) {
        db.query("SELECT * FROM formaentregas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static umedidas(callback) {
        db.query("SELECT * FROM umedidas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static rubros(callback) {
        db.query("SELECT * FROM rubros where idpadre=0", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static rubrosh(callback) {
        db.query("SELECT * FROM rubros where idpadre<>0 order by id", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static perfiles(callback) {
        db.query("SELECT * FROM perfiles where id<>1", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }
  }
  
  module.exports = Tablas;
  