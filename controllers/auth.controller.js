const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {

    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo })
    if( !usuario ){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo'
      })
    }

    //Si el Usuario esta activo 
    if ( !usuario.estado){
      return res.status(400).json({
        msg: 'Usuario / Pasword no son correctos - estado: false'
      })
    }

    // verificar la constraseña
      const validPassword = bcryptjs.compareSync( password, usuario.password )
      if( !validPassword ) { 
        return res.status( 400 ).json({
          msg: 'Usuario / Password no son corretos - password'
        })
      }

    // Generar el JWT 
    
    const token = await generarJWT( usuario.id )
      console.log( usuario.id)

    res.json({
      usuario,
      token
    });

  } catch (error) {
    console.log(error);
    //internal Server Error
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
