"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var albums_model_1 = require("../models/albums.model");
var AlbumsController = /** @class */ (function () {
    function AlbumsController() {
    }
    AlbumsController.prototype.getAlbums = function (request, response) {
        albums_model_1.Albums.find({}).then(function (albums) {
            response.json(albums);
        });
    };
    return AlbumsController;
}());
exports.default = AlbumsController;
