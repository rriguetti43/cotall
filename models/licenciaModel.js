const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

const Licencia = {
  crear: (data, callback) => {
    const sql = `INSERT INTO licencias (user_id, license_key, fecha_inicio, fecha_fin, activa)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [data.user_id, data.license_key, data.fecha_inicio, data.fecha_fin, data.activa], callback);
  },

  buscarPorClave: (clave, callback) => {
    db.query(`SELECT * FROM licencias WHERE license_key = ?`, [clave], callback);
  },

  buscarPorUsuario: (userId, callback) => {
    db.query(`SELECT * FROM licencias WHERE user_id = ? AND activa = 1`, [userId], callback);
  },

  obtenerLicencias: (usuario, expiraAntes, callback) => {
    let sql = `
      SELECT l.*, u.usuario 
      FROM licencias l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (usuario) {
      sql += ' AND u.usuario LIKE ?';
      params.push(`%${usuario}%`);
    }

    if (expiraAntes) {
      sql += ' AND l.fecha_fin < ?';
      params.push(expiraAntes);
    }

    db.query(sql, params, callback);
  },

  // Desactivar licencia
  desactivar: (id, callback) => {
    db.query('UPDATE licencias SET activa = 0 WHERE id = ?', [id], callback);
  },

  // Renovar licencia (1 año más desde hoy)
  renovar: (id, callback) => {
    const nuevaFechaFin = new Date();
    nuevaFechaFin.setFullYear(nuevaFechaFin.getFullYear() + 1);

    db.query(
      'UPDATE licencias SET fecha_inicio = CURDATE(), fecha_fin = ?, activa = 1 WHERE id = ?',
      [nuevaFechaFin.toISOString().split('T')[0], id],
      callback
    );
  },

  // Buscar licencia por usuario (para login, validación, etc.)
  buscarPorUsuario: (user_id, callback) => {
    db.query('SELECT * FROM licencias WHERE user_id = ? AND activa = 1', [user_id], callback);
  }

};

module.exports = Licencia;
