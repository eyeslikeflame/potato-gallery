import { Albums } from '../models/albums.model';
var formidable = require('formidable');
var util = require('util');
class AlbumsController {
    constructor() {

    }

    public getAlbums( request, response ) {
        Albums.find( {} ).then( albums => {
            response.json( albums );
        } );
    }

    public createAlbum( request, response ) {
        var form = new formidable.IncomingForm();
        form.parse(request, function(err, fields, files) {
            response.writeHead(200, {'content-type': 'text/plain'});
            response.write('received upload:\n\n');
            console.log(util.inspect({fields: fields, files: files}))
        });
        // Albums.create( {
        //     title: request.body.title
        // } ).then( created => {
        //     response.json( {
        //         id: created._id,
        //         message: 'Album is successfully saved'
        //     } )
        // })
    }
}

export default AlbumsController;
