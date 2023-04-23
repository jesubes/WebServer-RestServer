const Role = require("../models/role");
const Usuario = require('../models/usuario');


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


module.exports = {
  esRoleValido,
  emailExite,
  existeUsuarioPorId,
};
