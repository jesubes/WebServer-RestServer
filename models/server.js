const express = require ('express')
const cors = require( 'cors' );
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

require('dotenv').config()

class Server{

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    
    this.paths = {
        auth:       '/api/auth',
        buscar:     '/api/buscar',
        categorias: '/api/categorias',
        productos:  '/api/productos',
        usuarios:   '/api/usuarios',
        uploads:    '/api/uploads',
  }

    
    // this.usuariosPatch = '/api/usuarios'
    // this.authPath = '/api/auth';
    // this.categoriasPatch = '/api/categorias'

    //Conectar a base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();

  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares(){

    //CORS
    this.app.use( cors() )

    this.app.use( express.json() )

    //llamado al directorio public 
    this.app.use( express.static( 'public' ));

    //fileupload - Carga de archivos
    this.app.use( fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true,
    }))
  }

  routes() {

    this.app.use( this.paths.auth, require('../routes/auth.route'));
    
    this.app.use( this.paths.buscar, require('../routes/buscar.route'));
    
    this.app.use(this.paths.categorias, require('../routes/categorias.route'));
    
    this.app.use( this.paths.productos, require('../routes/productos.route'));
    
    this.app.use( this.paths.usuarios, require('../routes/usuarios.route'));
    
    this.app.use( this.paths.uploads, require('../routes/uploads.route'));
  }


  listen() {
    this.app.listen( this.port, () =>{
      console.log('Servidor corriendo en puerto ---> ', this.port )
    } )
  }
}


module.exports = Server;