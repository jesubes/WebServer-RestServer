const express = require ('express')
const cors = require( 'cors' );

require('dotenv').config()

class Server{
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPatch = '/api/usuarios'

    // Middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();

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