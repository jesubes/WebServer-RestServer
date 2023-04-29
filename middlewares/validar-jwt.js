const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


const validarJWT = async (req = request, res =  response, next ) => {

  const token = req.header('x-token')
  // jwt.verify(token)

  if( !token ){
    return res.status( 401 ).json({
      msg: 'No hay token en la petición'
    })
  }

  try{ 

    const  {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY )

    // req.uid = uid;

    //leer el usuario que corresponde al uid
    const usuario = await  Usuario.findById(uid)

    //en caso de no existir el usuario
    if( !usuario ){
      return res.status( 401 ).json({
        msg: 'Token no válido - usuario no existe en la DB'
      })
    }
  

    //Verificar si el uid tiene estado en true
    if( !usuario.estado ){
      return res.status( 401 ).json({
        msg: 'Token no válido - usuario con estado: false'
      })
    }


    req.usuario = usuario;
    next();

    
    
  } catch ( error ) {
    
    console.log( error )
    res.status( 401 ).json({ 
      msg: 'Token no válido'
    })
  }

}



module.exports = {
  validarJWT
}