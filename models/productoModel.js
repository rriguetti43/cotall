// /models/clienteModel.js
const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Producto {
  static getAll(idcia, callback) {

    var query = `SELECT a.*, ifnull(b.nombre,'Sin Información') categoria,
                case a.tipo
                    when 1 then 'Simple'
                    when 2 then 'Variado'
                    when 3 then 'Grupo'
                    when 4 then 'Servicio'
                    when 5 then 'Virtual'
                end as tipop    
                FROM Productos a 
                left join categorias b on a.idcat=b.id
                where a.idcia = ?
                order by id desc`

    db.query(query, [idcia], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getById(id, callback) {
    db.query("SELECT * FROM Productos WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  static create(producto, callback) {
    console.log(producto);
    db.query("INSERT INTO Productos SET ?", producto, (err, results) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  static update(id, producto, callback) {
    db.query(
      "UPDATE Productos SET ? WHERE id = ?",
      [producto, id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static delete(id, callback) {
    db.query("DELETE FROM Productos WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
}

module.exports = Producto;
