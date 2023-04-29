
const { Router } = require('express')
const { check } = require('express-validator');


const { login } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

//instanciar Router
const router = Router();


//pruba de primer path
router.post('/login', [
  check('correo', 'El Correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria!!!').not().isEmpty(),
  validarCampos,
], login )

module.exports = router