const { Router, response } = require("express");
const { check } = require("express-validator");

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria      } = require('../controllers/categorias.controller')

const { validarJWT, 
        validarCampos, 
        esAdminRole, 
        tieneRole     } = require("../middlewares");

const { existeCategoriaPorId  } = require('../helpers/db-validators');



//instanciar Router
const router = Router();

// {{url}}/api/categorias


// Obtener todas la categorias - publico
router.get('/', obtenerCategorias );


// Obtener una categoria por id - publico
router.get('/:id', [
  check('id', 'No es un id de MongoDB válido').isMongoId(),
  check('id').custom(  existeCategoriaPorId ),
  validarCampos,
], obtenerCategoria );


//Crear una categoria - privado - cualquier persona con un token cualquie rol
router.post("/",[
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos,
] , crearCategoria );


// Actualizar un registro por id - privado - cualquier rol (token)
router.put( "/:id",[
  validarJWT,
  check('id').custom( existeCategoriaPorId ),
  tieneRole('VENTA_ROLE', 'ADMIN_ROLE', 'USER_ROLE'),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos,
], actualizarCategoria );


// Borrar una categoria - Admin
router.delete("/:id",[
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de MongoDB válido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos,
], borrarCategoria );



module.exports = router;
