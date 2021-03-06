const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');


class Server {


    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios'

        };



        //Conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio Público
        this.app.use(express.static('public'));

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }



    routes() {

        //Logueo
        this.app.use(this.paths.auth, require('../routes/auth'));

        //Buscador
        this.app.use(this.paths.buscar, require('../routes/buscar'));

        //CRUD de Categorias
        this.app.use(this.paths.categorias, require('../routes/categorias'));

        //CRUD de Productos
        this.app.use(this.paths.productos, require('../routes/productos'));

        //Carga de Archivos
        this.app.use(this.paths.uploads, require('../routes/uploads'));

        //CRUD de Usuarios
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}


module.exports = Server;