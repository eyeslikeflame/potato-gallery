import * as express from 'express' ;
import * as path from 'path' ;
import * as logger from 'morgan' ;
import * as cookieParser from 'cookie-parser' ;
import * as bodyParser from 'body-parser' ;
import * as hbs from 'handlebars';
import MongoClient from './models/db.model';
import * as fs from 'fs';
import { albums } from './routes/albums';
import { photos } from './routes/photos';

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        MongoClient.connect();
        this.middleware();
        this.routes();

        if ( !fs.existsSync( path.join( globalAny.appRoot, '/pictures' ) ) ) {
            fs.mkdirSync( path.join( globalAny.appRoot, '/pictures' ) );
        }

        if ( !fs.existsSync( path.join( globalAny.appRoot, '/pictures/webp' ) ) ) {
            fs.mkdirSync( path.join( globalAny.appRoot, '/pictures/webp' ) );
        }

        if ( !fs.existsSync( path.join( globalAny.appRoot, '/pictures/jpeg' ) )) {
            fs.mkdirSync( path.join( globalAny.appRoot, '/pictures/jpeg' ) );
        }
    }

    private middleware(): void {
        this.express.set( 'view engine', 'hbs' );
        this.express.set( 'views', path.join( __dirname, 'views' ) );
        this.express.use( logger( 'dev' ) );
        this.express.use( bodyParser.json() );
        this.express.use( bodyParser.urlencoded( { extended: false } ) );
        this.express.use( cookieParser() );

        this.express.use( express.static( path.join( globalAny.appRoot, '/dist' ) ) );
    }

    private routes(): void {
        this.express.use( '/api/photos', photos );
        this.express.use( '/api/albums', albums );
        this.express.get( '*', ( request, response ) => {
            response.render( path.join( globalAny.appRoot, 'dist/index.hbs' ) );
        } );
    }
}

export let app = new App().express;
