const express = require ('express')
const cors = require( 'cors' );
const { dbConnection } = require('../database/config');

require('dotenv').config()

class Server{
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPatch = '/api/usuarios'

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

  }

  routes() {

    this.app.use( this.usuariosPatch, require('../routes/usuarios.route'))
    
  }

  listen() {
    this.app.listen( this.port, () =>{
      console.log('Servidor corriendo en puerto ---> ', this.port )
    } )
  }
}


module.exports = Server;