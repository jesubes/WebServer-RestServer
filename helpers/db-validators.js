const { Categoria, Role, Usuario, Producto } = require("../models");



const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });

  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};




const emailExite = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    
    throw new Error(`El email ${ correo } ya esta registrado en la BD`)
    // return res.status(400).json({
    //   msg: "Ese correo ya está registrado",
    // });
  }
};




const existeUsuarioPorId  = async ( id = '') => {
  
  const existeUsuario = await Usuario.findById( id );

  if ( !existeUsuario ) {
    throw new Error(`No exite el Usuario con id: ${ id }, en la BD`);
  }
};



/* 
* Validadores de CATEGORIAS
*/
const existeCategoriaPorId = async ( id = '') =>{
  const categoriaExiste = await Categoria.findById( id )
  if( !categoriaExiste ){
    throw new Error(`No exite la Categoria con id: ${ id }, en la BD`)
  }

}



//Validadores de Productos
const existeProductoPorId = async ( id = '') =>{
  const productoExiste = await Producto.findById( id )
  if ( !productoExiste ) {
    throw new Error (`No exite el producto con id: ${ id }, en la DB`)
  }
}

module.exports = {
  esRoleValido,
  emailExite,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId
};
