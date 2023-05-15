const { Router, response } = require('express')
const { check } = require('express-validator')

const { validarJWT, 
        validarCampos, 
        tieneRole,
        esAdminRole } = require('../middlewares')

const { obtenerProductos,
       crearProducto, 
       obtenerProducto, 
       actualizarProducto,
       borrarProducto} = require('../controllers/productos.controller')

const { existeProductoPorId, 
        existeCategoriaPorId } = require('../helpers/db-validators')


const router = Router()



//Obtener todos los productos - publico
router.get('/', obtenerProductos);



//Obtener un producto para visualizar - publico
router.get('/:id',[
  check('id', 'NO es un id de MongoDB válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos,
], obtenerProducto);



//Crear un producto - privado - cualqueir persona con rol (token)
router.post('/',[
  validarJWT,
  check('nombre','El nombre obligatorio').not().isEmpty(),
  check('categoria', 'No es un id de MongoDB').not().isEmpty(),
  check('categoria').custom( existeCategoriaPorId ),
  validarCampos,
], crearProducto );



//Actualizar un producto por id - privado - cualquier rol (token)
router.put('/:id',[
  validarJWT,
  check('id', 'No es un id de MongoDB válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  tieneRole( 'VENTA_ROLE', 'ADMIN_ROLE', 'USER_ROLE' ),
  check( 'nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria').custom( existeCategoriaPorId ),
  validarCampos,
] , actualizarProducto)



// Borrar un producto - privado - ADMIN_ROLE
router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de MongoDB válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos,
] , borrarProducto )



module.exports = router;