import * as express from 'express';
const globalAny: any = global;
import * as path from 'path';
// import { Photos } from '../models/photos.model';

class PhotosRoute {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.setRouter();
    }

    private setRouter(): void {

    }
}

export const photos = new PhotosRoute().router;

