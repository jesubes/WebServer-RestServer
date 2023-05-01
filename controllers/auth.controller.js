const { request, response, json } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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



const googleSignIn = async( req, res = response ) =>{

  const { id_token } = req.body;


  try {

    const { correo, nombre, img } = await googleVerify( id_token )

    //referencia si exite
    let usuario = await Usuario.findOne({ correo })

    if( !usuario ){
      // tengo que crearlo 
      const data= {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        rol: 'USER_ROLE'
      }
    
      usuario = new Usuario( data )
      await usuario.save()
    }

    //si el usuario en DB
    if( !usuario.estado){
      return res.status( 401 ).json({
        msg: 'Hable con el administrado, usuario bloqueado'
      })
    }


    //Generar el JWT
    const token = await generarJWT( usuario.id )
    
    res.json({
      usuario,
      token,
    })

  } catch ( error ) {
      res.status(400).json({
        ok: false,
        msg: 'El token no se pudo verificar'
      })
  }


}

module.exports = {
  login,
  googleSignIn,
};
