const { response, request } = require("express");
const { Categoria } = require('../models');



// obtenerCategorias - paginado - total - metodo populate
const obtenerCategorias = async ( req = request, res = response ) => {

  //traer las categorias con  con paginación
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }

  // hacer mas efecciente el codigo de la respuesta de las promesas ya que ejecuta las 2 promesas al mismo tiempo y demora casi el 50% menos
  //  populate('usuario') ---> me trae la informacion del usuario que pase el token (todos los campos del schema)
  const [ total,categorias ] = await Promise.all([
    Categoria.countDocuments( query ),
    Categoria.find( query ).populate('usuario', 'nombre')
      .skip( Number( desde ))
      .limit( Number( limite )),
  ])


  res.json({
    total,
    categorias
  })
}



//obtenerCategoria - populete{}
const obtenerCategoria = async( req = request, res = response ) =>{
  //traer una categoria con el id del params
  const { id } = req.params;

  const categoria = await Categoria.findById( id ).populate('usuario', 'nombre')

  res.json({
    categoria,
  })
}



//CrearCategoria
const crearCategoria = async (req, res = response ) => {

  const nombre = req.body.nombre.toUpperCase();

  //comprobar si exite la misma categoria en la base de datos
  const categoriaDB = await Categoria.findOne({ nombre })

  if( categoriaDB ) {
    return res.status(400).json({
      msg: `La categoria ${ categoriaDB.nombre }, ya existe`
    })
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  }

  const categoria = new Categoria( data )

  //Guardar DB
  await categoria.save()

  res.status( 201 ).json( categoria )
  
}



// actualizarCategoria
const actualizarCategoria = async ( req, res = response ) =>{
  const { id } = req.params;
  const nombre = req.body.nombre.toUpperCase();


  //comprobar si exite la misma categoria en la base de datos
  const categoriaDB = await Categoria.findOne({ nombre })

  if( categoriaDB ){
    return res.status(400).json({
      msg: `La categoria ${ categoriaDB.nombre }, ya existe`
    })
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  }
 
  // con {new: true} --> puedo visualisar cuando trae la respuesta los datos ya actualizados
  const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } ).populate( 'usuario', 'nombre' )

  res.json( categoria )
}



// borrarCategoria - estado: false
const borrarCategoria = async ( req, res = response ) =>{
  const { id } = req.params

  const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true }).populate('usuario','nombre')

  res.json({
    categoria,
  })

}




module.exports =  {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
}