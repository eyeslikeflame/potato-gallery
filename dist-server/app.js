"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var db_model_1 = require("./models/db.model");
var albums_1 = require("./routes/albums");
var globalAny = global;
globalAny.appRoot = process.cwd();
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        db_model_1.default.connect();
        this.middleware();
        this.routes();
    }
    App.prototype.middleware = function () {
        this.express.set('view engine', 'hbs');
        this.express.set('views', path.join(__dirname, 'views'));
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(globalAny.appRoot, '/dist')));
    };
    App.prototype.routes = function () {
        this.express.use('/api/albums', albums_1.albums);
        this.express.get('*', function (request, response) {
            response.render(path.join(globalAny.appRoot, 'dist/index.hbs'));
        });
    };
    return App;
}());
exports.app = new App().express;
