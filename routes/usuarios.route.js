
const { Router } = require('express')
const { check } = require('express-validator');
const router = Router();
const { usuariosGet,
  usuariosPut, 
  usuariosPost, 
  usuariosDelete, 
  usuariosPatch } = require( '../controllers/usuarios.controller');
const { esRoleValido, emailExite, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');


//GET
router.get('/', usuariosGet)


//POST
router.post('/',[
  check('nombre','Nombre es Obligatorio!!!').not().isEmpty(),
  check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
  check('correo','Correo Invalido!!!').isEmail(),
  check('correo').custom( correo => emailExite (correo)),
  // check('rol', 'No es un rol Valido!!!').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( rol =>  esRoleValido(rol) ),
  validarCampos,
] ,usuariosPost )


//PUT
router.put('/:id',[
  check('id','No es un id de MONGODB!!!').isMongoId(),
  check('id').custom( id => existeUsuarioPorId( id ) ),
  check('rol').custom( rol =>  esRoleValido(rol) ),
  validarCampos
], usuariosPut )


//PATCH
router.patch('/', usuariosPatch )


//DELETE
router.delete('/:id',[
  check('id','No es un id de MONGODB!!!').isMongoId(),
  check('id').custom( id => existeUsuarioPorId( id ) ),
  validarCampos
], usuariosDelete )


module.exports = router