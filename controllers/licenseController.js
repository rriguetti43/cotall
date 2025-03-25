const Licencia = require('../models/licenciaModel');

function generarClaveLicencia() {
  const base = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `LIC-${base}`;
}

exports.crearLicencia = (req, res) => {
  const { user_id, fecha_inicio, fecha_fin } = req.body;
  const licencia = {
    user_id,
    license_key: generarClaveLicencia(),
    fecha_inicio,
    fecha_fin,
    activa: 1
  };

  Licencia.crear(licencia, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear licencia' });
    res.json({ mensaje: 'Licencia generada', licencia });
  });
};

exports.validarLicencia = (req, res) => {
  const { license_key } = req.body;

  Licencia.buscarPorClave(license_key, (err, resultados) => {
    if (err || resultados.length === 0) {
      return res.status(400).json({ mensaje: 'Licencia inválida' });
    }

    const licencia = resultados[0];
    const hoy = new Date();
    const expira = new Date(licencia.fecha_fin);

    if (!licencia.activa || hoy > expira) {
      return res.json({ mensaje: 'Licencia expirada o desactivada' });
    }

    res.json({ mensaje: 'Licencia válida', licencia });
  });
};

exports.verEstadoLicencia = (req, res) => {
  const userId = req.params.userId;

  Licencia.buscarPorUsuario(userId, (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al consultar licencia' });

    if (resultados.length === 0) {
      return res.json({ mensaje: 'Sin licencia activa' });
    }

    res.json({ licencia: resultados[0] });
  });
};
