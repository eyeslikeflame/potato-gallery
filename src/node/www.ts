import { app } from './app';
import * as http from 'http';

const debug = require( 'debug' )( 'gallery:server' );

class Server {
    public server;
    private port;

    constructor() {
        this.port = this.normalizePort( process.env.PORT || '3000' );
        app.set( 'port', this.port );

        this.server = http.createServer( app );

        this.server.listen( this.port );
        this.server.on( 'error', this.onError );
        // this.server.on( 'listening', this.onListening );

    }

    private normalizePort( val ) {
        const port = parseInt( val, 10 );

        if ( isNaN( port ) ) {
            // named pipe
            return val;
        }

        if ( port >= 0 ) {
            // port number
            return port;
        }

        return false;
    }

    private onError( error ) {
        if ( error.syscall !== 'listen' ) {
            throw error;
        }

        const bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch ( error.code ) {
            case 'EACCES':
                console.error( bind + ' requires elevated privileges' );
                process.exit( 1 );
                break;
            case 'EADDRINUSE':
                console.error( bind + ' is already in use' );
                process.exit( 1 );
                break;
            default:
                throw error;
        }
    }

    // onListening() {
    //     const addr = this.server.address();
    //     const bind = typeof addr === 'string'
    //         ? 'pipe ' + addr
    //         : 'port ' + addr.port;
    //     debug( 'Listening on ' + bind );
    // }

}

const kek = new Server();
