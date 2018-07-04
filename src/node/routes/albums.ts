import * as express from 'express';
const globalAny: any = global;
import * as path from 'path';
import AlbumsController from '../controllers/albums.controller';

class AlbumsRoute {
    public router: express.Router;
    private controller: AlbumsController;

    constructor() {
        this.router = express.Router();
        this.controller = new AlbumsController();
        this.setRouter();
    }

    private setRouter(): void {
        this.router.get('/', this.controller.getAlbums);
    }
}

export const albums = new AlbumsRoute().router;

