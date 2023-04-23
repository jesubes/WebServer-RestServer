const { response, request } = require("express")
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')


const usuariosGet = async ( req = request, res = response ) => {

  //traer los usuarios con paginación
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }

  // hacer mas efecciente el codigo de la respuesta de las promesas ya que ejecuta las 2 promesas al mismo tiempo y demora casi el 50% menos
  const [ total,usuarios ] = await Promise.all([
    Usuario.countDocuments( query ),
    Usuario.find( query )
      .skip( Number( desde ))
      .limit( Number( limite )),
  ])


  res.json({
    total,
    usuarios
  })
}


const usuariosPut = async ( req = request, res = response ) => {
  const { id } = req.params;
  const { _id, password,  google, correo, ...resto } = req.body


  if( password ){
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt )
  }


  const usuario = await Usuario.findByIdAndUpdate( id, resto )


  res.json( usuario );
}



const usuariosPost = async ( req, res = response ) => {

  const { nombre, correo, password, rol } = req.body
  const usuario = new Usuario( {nombre, correo, password, rol} )

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt )

  //guardar en DB
  await usuario.save();

  res.json({
    usuario,
  })
}

const usuariosPatch = ( req, res = response ) => {
  res.json({
    msg: 'Patch API - Controlador'
  })
}

const usuariosDelete = async( req, res = response ) => {

  const { id } = req.params;
  
  //Fisicamente lo borramos con lo siguiente
  // const usuario = await Usuario.findByIdAndDelete( id )

  // (INTEGRIDAD REFERENCIAL) borrar usuario de forma que no afecte las referencias de otras colecciones que interactuo el usuario borrado
  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false })

  res.json({
    usuario
  })
}

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete
}