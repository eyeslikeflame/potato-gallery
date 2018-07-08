import * as express from 'express';

const globalAny: any = global;
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
        this.router.get( '/', ( request, response ) => {
            this.controller.getAlbums( request, response );
        } );

        this.router.get( '/:id', ( request, response ) => {
            this.controller.getAlbum( request, response );
        } );

        this.router.delete( '/delete/:id', ( request, response ) => {
            this.controller.deleteAlbum( request, response );
        } );
        this.router.post( '/delete/', ( request, response ) => {
            this.controller.deleteAlbums( request, response );
        } );
        this.router.post( '/new-album/save', ( request, response ) => {
            this.controller.createAlbum( request, response );
        } );
    }
}

export const albums = new AlbumsRoute().router;

