const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Cotizacion {

    static getAll(idcia, callback) {

        var query = `SELECT a.id, numcot, ifnull(c.razonsocial, concat(c.nombre, ' ', c.apellido)) cliente,c.email, c.telefonows, 
                    fecha, b.nombre monedas, totcot 
                    FROM cotizacion_cab a 
                    join monedas b on a.idmon=b.id
                    join clientes c on a.idcli=c.id
                    where a.idcia = ?
                    order by a.id desc`

        db.query(query, [idcia], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
    }

    static buscaAllCli(id,callback) {
        db.query("select id, ifnull(razonsocial, CONCAT(nombre,apellido)) nombre from clientes where idcia=?", [id], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
    }

    static buscaAllProd(id,callback) {
        db.query("select id, nombre from productos where idcia=?", [id], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
    }

    static obtieneProdId(id, callback) {
        //console.log(id);
        db.query("SELECT * FROM Productos WHERE id = ?", [id], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results[0]);
        });
    }  

    static contador(id,callback){
      db.query("SELECT num_co FROM contador_doc WHERE idcia = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        let num = results[0].num_co;
        //console.log('Resultado como entero:',num);
        callback(null, num);
      });
    }

    static obtienecontador(id,callback){
      db.query("UPDATE contador_doc SET num_co = num_co + 1 WHERE idcia = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        else
        {
          db.query("SELECT num_co FROM contador_doc WHERE idcia = ?", [id], (err, results) => {
            if (err) {
              return callback(err);
            }
            let num = results[0].num_co;
            //console.log('Resultado como entero:',num);
            callback(null, num);
          });
        }
      });
    }

    static crearCotizacion(cotizacion, callback) {

      //console.log(cotizacion[0].fecha);

        const query = `
          INSERT INTO cotizacion_cab (numcot, fecha, idcli, tipopago, condicionentrega, fechaentrega, iduser, idmon, descripcion, subtotcot, igvcot, totcot, idcia)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
          cotizacion.numcot,
          cotizacion[0].fecha,
          cotizacion[0].idcli,
          cotizacion[0].tipopago,
          cotizacion[0].condicionentrega,
          cotizacion[0].fechaentrega,
          cotizacion.iduser,
          cotizacion[0].idmon,
          cotizacion[0].descripcion,
          cotizacion[0].subtotcot,
          cotizacion[0].igvcot,
          cotizacion[0].totcot,
          cotizacion[0].idcia
        ], (err, results) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, results);
          }
        });
    }

    static obtieneCotIdPDF(id, callback){
      //console.log(id);
      var query = `SELECT a.numcot, 
                  a.fecha, 
                  a.iduser, 
                  UPPER(ifnull(b.razonsocial, concat(b.nombre, ' ', b.apellido))) nombres_cli, 
                  b.ruc ruc_cli, 
                  b.contacto contac_cli, 
                  b.direccion direccion_cli, 
                  b.email email_cli, 
                  b.telefonoct telcontac_cli, 
                  a.subtotcot, 
                  a.igvcot, 
                  a.totcot, 
                  d.nombre formapago, 
                  e.nombre formaentrega, 
                  a.descripcion, 
                  a.fechaentrega,
                  UPPER(f.nombre) nombre_cia,
                  f.documento ruc_cia,
                  f.direccion direccion_ruc,
                  f.email email_cia,
                  f.telefono telefono_cia,
                  f.imagen logo_cia,
                  concat(g.nombres, ' ', b.apellido) agente_nombre,
                  g.email agente_email,
                  c.nombre moneda,
                  g.telefono agente_telefono
                  FROM cotizacion_cab a 
                  JOIN clientes b ON a.idcli = b.id 
                  JOIN monedas c ON a.idmon = c.id 
                  JOIN formapagos d ON a.tipopago=d.id 
                  JOIN formaentregas e ON a.condicionentrega=e.id 
                  JOIN compania f ON a.idcia=f.id
                  JOIN users g ON a.iduser=g.id
                  where a.id = ?;`

      db.query(query, [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results[0]);
      });
    }

    static obtieneCotIdPDFDetalle(id, callback){
      //console.log(id);
      var query = `select b.codigo, b.nombre, b.descripcion, c.corto, 
                  a.cantidad, a.preciounit, a.subtotal 
                  from cotizacion_det a 
                  JOIN productos b on a.idprod=b.id 
                  JOIN umedidas c on a.idumd=c.id 
                  where a.idcot = ?`

      db.query(query, [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }

}

module.exports = Cotizacion;
