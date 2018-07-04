"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var globalAny = global;
var albums_controller_1 = require("../controllers/albums.controller");
var AlbumsRoute = /** @class */ (function () {
    function AlbumsRoute() {
        this.router = express.Router();
        this.controller = new albums_controller_1.default();
        this.setRouter();
    }
    AlbumsRoute.prototype.setRouter = function () {
        this.router.get('/', this.controller.getAlbums);
    };
    return AlbumsRoute;
}());
exports.albums = new AlbumsRoute().router;
