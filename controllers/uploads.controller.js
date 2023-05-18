const { response, request } = require('express');
const fs = require('fs');
const  path = require ('path')
const cloudinary = require('cloudinary').v2
  //configurar nuestra cuenta
  cloudinary.config( process.env.CLOUDINARY_URL )

const https = require('https')

const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')



const cargarArchivo = async ( req, res = response ) => {


  try {
    //txt, md
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos')
    //imagenes
    const nombre = await subirArchivo( req.files, undefined, 'imgs')
    res.json({ nombre })

  } catch ( msg ) {
    res.status( 400 ).json({ msg })
  }


}


//actualizarImagen
const actualizarImagen = async ( req = request, res = response ) =>{


  const { id, coleccion } = req.params

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un usuario con el id ${ id }`,
        })
      }
    break;
    
    case 'productos':
      modelo = await Producto.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un productos con el id ${ id }`,
        })
      }
    break;

    default:
      return res.status( 500 ).json({ msg: 'se me olvidó validar esto'})
  }

  //Limpiar imagenes previas
  if( modelo.img ){
    //hay que borrar la imagen del sevidor 
    const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img )
    if( fs.existsSync( pathImage )){
      fs.unlinkSync( pathImage )
    }
  }

  
  //subo el archivo imagen con un nombre de uuid y en el directorio del nombre de la coleccion
  const nombre = await subirArchivo( req.files, undefined, coleccion)
  modelo.img = nombre;

  //guardo en DB
  await modelo.save();


  res.json({
    modelo
  })
}



//mostarImagen
const mostarImagen = async( req, res = response ) =>{
  
  const { id, coleccion } = req.params

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un usuario con el id ${ id }`,
        })
      }
    break;
    
    case 'productos':
      modelo = await Producto.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un productos con el id ${ id }`,
        })
      }
    break;

    default:
      return res.status( 500 ).json({ msg: 'se me olvidó validar esto'})
  }

  //Servir imagen
  if( modelo.img ){
    //hay que borrar la imagen del sevidor 
    const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img )
    if( fs.existsSync( pathImage )){
      return res.sendFile( pathImage )
    }
  }

  const pathImage = path.join( __dirname, '../assets/no-image.jpg')
  if( fs.existsSync( pathImage )){
    return res.sendFile( pathImage )
  }
}


//Con cloudinary
const actualizarImagenCloudinary = async ( req = request, res = response ) =>{


  const { id, coleccion } = req.params

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un usuario con el id ${ id }`,
        })
      }
    break;
    
    case 'productos':
      modelo = await Producto.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un productos con el id ${ id }`,
        })
      }
    break;

    default:
      return res.status( 500 ).json({ msg: 'se me olvidó validar esto'})
  }

  //Limpiar imagenes previas
  if( modelo.img ){
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr[ nombreArr.length - 1 ]
    const [ public_id ] = nombre.split('.')

    //borrar imagen con id publico de la imagen con el comando de cloudinary
    cloudinary.uploader.destroy( public_id  )

  }

  //subo a cloudinary
  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
  // en el schema gurado la dir de la imagen de cloudinary
  modelo.img = secure_url;

  //guardo en DB
  await modelo.save();


  res.json({
    modelo
  })
}


//monstrar iamgen con cloudinary
const mostarImagenCoudinary = async( req, res = response ) =>{
  
  const { id, coleccion } = req.params

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un usuario con el id ${ id }`,
        })
      }
    break;
    
    case 'productos':
      modelo = await Producto.findById( id )
      if( !modelo ){
        return res.status( 400 ).json({
          msg: `No existe un productos con el id ${ id }`,
        })
      }
    break;

    default:
      return res.status( 500 ).json({ msg: 'se me olvidó validar esto'})
  }

  //***************************** */
  //Servir imagen con una direccion https
  if( modelo.img ){
    //configurar la respuesta para que sea una imagen 
    res.setHeader('Content-Type','image/jpeg')

    https.get( modelo.img, respuesta =>{
      respuesta.pipe( res )
    })

    return true
  }

  const pathImage = path.join( __dirname, '../assets/no-image.jpg')
  if( fs.existsSync( pathImage )){
    return res.send( pathImage )
  }
}



module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostarImagen,
  actualizarImagenCloudinary,
  mostarImagenCoudinary,
}