import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';
const globalAny: any = global;
globalAny.appRoot    = process.cwd();

class PhotosController {
    constructor() {

    }

    public getPhoto(request, response) {
        response.sendFile(path.join(globalAny.appRoot, 'pictures', `${request.params.src}`));
    }

}

export default PhotosController;
