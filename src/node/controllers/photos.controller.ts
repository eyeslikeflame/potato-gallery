import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp'

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class PhotosController {

    constructor() {

    };

    public getPhoto( request, response ) {
        let type = '.jpeg';
        let preview = '';
        if (request.query.preview) {
            preview = 'preview_';
        }
        switch ( request.useragent && request.useragent.browser ) {
            case 'Chrome':
                type = '.webp';
                break;
            default:
                console.log( 'not supported' );
        }
        response.sendFile( path.join( globalAny.appRoot, `pictures/${request.params.src}`, `${preview}${request.params.src}${type}` ) );
    }

    public async savePhotos( files, albumId ) {
        function format( files, id ) {
            const temp = [];
            for ( let i in files ) {
                temp.push( {
                    title:      files[ i ].name,
                    src:        files[ i ].path.match( /[a-z0-9_.]+$/i )[ 0 ],
                    album:      new Types.ObjectId( id ),
                    uploadDate: new Date(),
                } );
            }
            return temp;
        }

        this.optimizePhotos( files );
        return Photos.insertMany( format( files, albumId ) );
    }

    private async optimizePhotos( files ) {
        let fileName;
        let file;
        let dir;
        for ( let i in files ) {
            fileName = files[ i ].path.match( /[a-z0-9_.]+$/i ).toString();
            file = fs.readFileSync( path.join( globalAny.appRoot, `/pictures/raw/${fileName}` ) );
            dir = path.join( globalAny.appRoot, `/pictures/${fileName}` );
            fs.mkdirSync( dir );
            sharp( file ).toFile( path.join( dir, `${fileName}.webp` ) );
            sharp( file ).toFile( path.join( dir, `${fileName}.jpeg` ) );

            await sharp( file )
                .resize( null, 300 )
                .toFile( path.join( dir, `preview_${fileName}.webp` ) );
            await sharp( file )
                .resize( null, 300 )
                .toFile( path.join( dir, `preview_${fileName}.jpeg` ) );

            fs.unlink( path.join( globalAny.appRoot, `/pictures/raw/${fileName}` ), err => {
                if ( err ) {
                    console.log( err );
                }
            } )
        }
    }

    public deletePhotos( request, response ) {
        const photoArr = Object.values( request.body );
        Photos.find( {
            _id: {
                $in: photoArr
            }
        } ).then( photos => {
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
            } ).then( removed => {
                Photos.findOne( {
                    album: request.params.id
                } ).then( photo => {
                    Albums.update( {
                        _id: new Types.ObjectId( request.params.id )
                    }, {
                        $set: {
                            preview: new Types.ObjectId( photo._id )
                        }
                    } ).then();
                } );
            } );

            response.json( {
                success: true,
                message: `Successfully deleted ${photoArr.length} photo${photoArr.length > 1 ? 's' : ''}`
            } );
        } );
    }
}

export default PhotosController;
