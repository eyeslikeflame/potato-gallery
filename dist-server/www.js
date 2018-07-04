"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var http = require("http");
var debug = require('debug')('gallery:server');
var Server = /** @class */ (function () {
    function Server() {
        this.port = this.normalizePort(process.env.PORT || '3000');
        app_1.app.set('port', this.port);
        this.server = http.createServer(app_1.app);
        this.server.listen(this.port);
        this.server.on('error', this.onError);
        // this.server.on( 'listening', this.onListening );
    }
    Server.prototype.normalizePort = function (val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    };
    Server.prototype.onError = function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    return Server;
}());
var kek = new Server();
