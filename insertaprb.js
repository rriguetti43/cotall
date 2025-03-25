const bcrypt = require('bcryptjs');
const db = require('./config/db');

// Datos del usuario
const email = 'usuario2@prueba.com';
const password = 'contraseñaSegura2';

// Encriptar la contraseña
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
    return;
  }

  // Insertar en la base de datos
  db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Usuario registrado');
    }
  });
});