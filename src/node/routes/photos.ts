import * as express from 'express';
const globalAny: any = global;
import * as path from 'path';
import PhotosController from '../controllers/photos.controller';
// import { Photos } from '../models/photos.model';

class PhotosRoute {
    public router: express.Router;
    private controller: PhotosController;

    constructor() {
        this.router = express.Router();
        this.controller = new PhotosController();
        this.setRouter();
    }

    private setRouter(): void {
        this.router.get( '/get-photo/:src', (request, response) => {
            this.controller.getPhoto(request, response);
        } );
    }
}

export const photos = new PhotosRoute().router;

