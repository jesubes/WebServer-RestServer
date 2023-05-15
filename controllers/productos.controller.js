const { response, request } = require('express')
const { Producto } = require('../models');

//ObtenerProductos - paginado - total - metodo papulate
const obtenerProductos = async (req = request, res = response ) =>{

  //traer las categorias con paginacion
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }

  //hacer mas efisciente el codigo de respuesta de las promesas
  const [ total, productos ] = await Promise.all([
    Producto.countDocuments( query ),
    Producto.find( query )
      .populate('usuario','nombre')
      .populate('categoria', 'nombre')
      .skip( Number( desde ))
      .limit( Number( limite )),
  ])


  res.json({
    total,
    productos,
  })

}


//obtenerProducto - populate
const obtenerProducto = async( req, res ) => {

  //traer una categoria con el id del params}
  const  { id } = req.params;

  const producto = await Producto.findById ( id )
          .populate( 'usuario', 'nombre' )
          .populate( 'categoria', 'nombre')

  res.json({
    producto,
  })
}


//crearProducto
const crearProducto = async( req, res = response ) =>{
  
  const { estado, usuario, ...body } = req.body

  //comprobar si exite el mismo producto en la base de datos
  const productoDB = await Producto.findOne({ nombre: body.nombre })

  if( productoDB ){
    return res.status( 400 ).json({
      msg: `El producto  ${ productoDB.nombre }, ya existe`
    })
  }
  

  //generar la data a guardar 
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  }

  const producto = new Producto( data )

  //Guardar DB
  await producto.save()

  res.status( 201 ).json( producto )

}


//actualizarProducto - populate - todos los roles
const actualizarProducto = async( req, res = response ) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if( data.nombre ){
    data.nombre = data.nombre.toUpperCase();
  }

  //el usuario seria el que lo esta actualizando
  data.usuario = req.usuario._id

  //No voy a comprobar si existe algun producto por el mismo nombre ya que quiero poder dar la flexibilidad a la API de poder repetir nombres de productos


  // con {new: true} --> puedo visualisar cuando trae la respuesta los datos ya actualizados
  const producto = await Producto.findByIdAndUpdate( id, data, { new: true})
                                  .populate( 'usuario', 'nombre' )
                                  .populate( 'categoria', 'nombre');
  
  res.json( producto )                                  
}



//borrarCategorias - cambia estado: false - populate - solo ADMIN_ROLE
const borrarProducto = async ( req, res = response ) =>{
  const { id } = req.params

  const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true })
                                  .populate( 'usuario', ('nombre', 'rol'))

  res.json({
    productoBorrado
  })                             
}




module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
}