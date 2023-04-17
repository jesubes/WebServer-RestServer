const { response } = require("express")

const usuariosGet = ( req, res = response ) => {

  res.json({
    msg: 'get API - controlador'
  })
}

const usuariosPut = ( req, res = response ) => {
  res.json({
    msg: 'Put API - Controlador'
  })
}

const usuariosPost = ( req, res = response ) => {

  const { nombre, edad } = req.body

  res.json({
    msg: 'Post API - Controlador',
    nombre,
    edad,
  })
}

const usuariosPatch = ( req, res = response ) => {
  res.json({
    msg: 'Patch API - Controlador'
  })
}

const usuariosDelete = ( req, res = response ) => {
  res.json({
    msg: 'Delete API - Controlador'
  })
}

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete
}