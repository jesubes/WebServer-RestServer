const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostarImagen, actualizarImagenCloudinary, mostarImagenCoudinary } = require('../controllers/uploads.controller');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');




const router = Router();


router.post('/',[
  validarArchivoSubir,
],  cargarArchivo )

router.put('/:coleccion/:id',[
  validarArchivoSubir,
  check('id','El id debe de ser de mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
  validarCampos,
], actualizarImagenCloudinary )
// ], actualizarImagen )

//Servir imagen para consumir en html
router.get('/:coleccion/:id',[
  check('id','El id debe de ser de mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
  validarCampos,
], mostarImagenCoudinary )
// ], mostarImagen )


module.exports = router