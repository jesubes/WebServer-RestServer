const { request, response } = require("express");
const { Usuario, Producto, Categoria } = require("../models");
const { ObjectId } = require('mongoose').Types;



const coleccionesPermitidas = [
  'usuarios',
  'categorias',
  'productos',
  'roles',
]


//buscarUsuarios
const buscarUsuarios = async( termino = '', res = response ) => {

  const esMongoID = ObjectId.isValid( termino ); //TRUE

  if( esMongoID ){
    const usuario = await Usuario.findById( termino );
    return  res.json({
      results: ( usuario ) ? [ usuario ] : [],
    }) 
  }

  const regex = new RegExp( termino, 'i')

  
  // reducir tiempo de espera
  const [ total, usuarios ] = await Promise.all([
              Usuario.count({
                $or: [{ nombre: regex}, { correo: regex }],
                $and: [{ estado: true }],
              }),
  
              Usuario.find({
                $or: [{ nombre: regex }, { correo: regex }],
                $and: [{ estado: true }]
              })
  ])


  res.json({ 
    results: {total: total}, usuarios 
  })

}


//bucarProductos
const buscarProductos  = async( termino = '', res = response ) => {

  const esMongoID = ObjectId.isValid( termino ); //TRUE

  if( esMongoID ){
    const producto = await Producto.findById( termino );
    return  res.json({
      results: ( producto ) ? [ producto ] : [],
    }) 
  }

  const regex = new RegExp( termino, 'i')

  
  // reducir tiempo de espera
  const [ total, productos ] = await Promise.all([
              Producto.count({ nombre: regex, estado: true }),
              Producto.find({ nombre: regex, estado: true })
                      .populate('usuario', 'nombre')
                      .populate('categoria', 'nombre'),
  ])


  res.json({ 
    results: {total: total}, productos 
  })

}


//buscarCategorias
const buscarCategorias  = async( termino = '', res = response ) => {

  const esMongoID = ObjectId.isValid( termino ); //TRUE

  if( esMongoID ){
    const categorias = await Categoria.findById( termino );
    return  res.json({
      results: ( categorias ) ? [ categorias ] : [],
    }) 
  }

  const regex = new RegExp( termino, 'i')

  
  // reducir tiempo de espera
  const [ total, categorias ] = await Promise.all([
              Categoria.count({ nombre: regex, estado: true }),
              Categoria.find({ nombre: regex, estado: true })
                        .populate('usuario', 'nombre'),
  ])


  res.json({ 
    results: {total: total}, categorias 
  })

}


//*--------------------------------------------------------------*/
// controlador de buscar
const buscar = (req = request, res = response ) =>{

  const { coleccion, termino } = req.params

  if( !coleccionesPermitidas.includes( coleccion )){
    return res.status( 400 ).json({
      msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
    })
  }

  switch ( coleccion ) {
    
    case  'usuarios':
      buscarUsuarios( termino , res )
    break;
    
    case  'categorias':
      buscarCategorias( termino, res )
    break;

    case  'productos':
      buscarProductos( termino, res )
    break;

    default:
        res.status( 500 ).json({
          msg: 'Se le olvido hacer esta Búsqueda'
        })
  }


  // res.json({
  //   coleccion,
  //   termino,
  //   msg: 'Buscar....'
  // })
}



module.exports = {
  buscar,
}