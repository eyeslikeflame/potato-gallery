"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var globalAny = global;
// import { Photos } from '../models/photos.model';
var PhotosRoute = /** @class */ (function () {
    function PhotosRoute() {
        this.router = express.Router();
        this.setRouter();
    }
    PhotosRoute.prototype.setRouter = function () {
    };
    return PhotosRoute;
}());
exports.photos = new PhotosRoute().router;
