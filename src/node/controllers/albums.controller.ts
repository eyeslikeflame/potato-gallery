import { Albums } from '../models/albums.model';

class AlbumsController {
    constructor() {

    }

    public getAlbums( request, response ) {
        Albums.find({}).then( albums => {
            response.json(albums);
        });
    }
}

export default AlbumsController;
