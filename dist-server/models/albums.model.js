"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var albumsSchema = new mongoose_1.Schema({
    title: String,
    previews: Array,
    fav: Boolean,
    onwer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { versionKey: false });
exports.Albums = mongoose_1.model('albums', albumsSchema);
