
const { Router } = require('express')
const { check } = require('express-validator');


const { login, googleSignIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

//instanciar Router
const router = Router();


//pruba de primer path
router.post('/login', [
  check('correo', 'El Correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria!!!').not().isEmpty(),
  validarCampos,
], login )

//autenticacion Google Sign-in
router.post('/google', [
  check('id_token', 'id_token es necesario').not().isEmpty(),
  validarCampos,
], googleSignIn )

module.exports = router