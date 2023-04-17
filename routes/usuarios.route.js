
const { Router } = require('express')

const router = Router();

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require( '../controllers/usuarios.controller')

router.get('/', usuariosGet)

router.post('/', usuariosPost )

router.put('/', usuariosPut )

router.patch('/', usuariosPatch )

router.delete('/', usuariosDelete )


module.exports = router