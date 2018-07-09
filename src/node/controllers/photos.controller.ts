import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class PhotosController {
    constructor() {

    }

    public getPhoto( request, response ) {
        response.sendFile( path.join( globalAny.appRoot, 'pictures', `${request.params.src}` ) );
    }

    public deletePhotos( request, response ) {
        const photoArr = Object.values(request.body);
        Photos.find({
            _id: {
                $in: photoArr
            }
        }).then( photos => {
            photos.map( el => {
                fs.unlink( path.join( globalAny.appRoot, '/pictures', el.src ), ( err ) => {
                    if ( err ) {
                        response.json( err );
                    }
                    console.log( 'deleted' );
                } );
            } );

            Photos.remove( {
                _id: {
                    $in: photoArr
                }
            } ).then();

            response.json({
                success: true,
                message: `Successfully deleted ${photoArr.length} photo${photoArr.length > 1 ? 's' : ''}`
            });
        });
    }
}

export default PhotosController;
