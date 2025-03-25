const Licencia = require('../models/licenciaModel');

exports.vistaPanelLicencias = (req, res) => {
  const { usuario, expiraAntes } = req.query;
  Licencia.obtenerLicencias(usuario, expiraAntes, (err, licencias) => {
    if (err) return res.status(500).send('Error cargando licencias');
    res.render('usuarios/adminLicencias', { licencias });
  });
};

exports.desactivarLicencia = (req, res) => {
  Licencia.desactivar(req.params.id, () => {
    res.redirect('/admin/licencias');
  });
};

exports.renovarLicencia = (req, res) => {
  Licencia.renovar(req.params.id, () => {
    res.redirect('/admin/licencias');
  });
};
