import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';
import * as sharp from 'sharp'
import { detect } from 'detect-browser';
import { Buffer } from "buffer";

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class PhotosController {
    browser: detect;

    constructor() {
        this.browser = detect();
    };

    public getPhoto( request, response ) {
        // switch (this.browser && this.browser.name) {
        //     case 'chrome':
        //
        //     default:
        //         console.log('not supported');
        // }
        // response.sendFile( path.join( globalAny.appRoot, 'pictures', `${request.params.src}` ) );
        const pathName = path.join( globalAny.appRoot, 'pictures', `${request.params.src}` );
        this.formatPhoto( pathName, 'webp', { x: null, y: 500 }, request.params.src ).then( photo => {
            // response.sendFile( path.join( globalAny.appRoot, 'pictures', `${request.params.src}` ) );
            // response.set('Cache-Control', 'public, max-age=86400').send( photo );
            response.send( photo );
        } ).catch( err => {
            console.log( err );
        } );

    }

    public async formatPhoto( path: string, type: string, resolution: { x: number, y: number }, title ) {
        const buffer = await sharp( path ).resize( resolution.x, resolution.y ).webp( { lossless: true } ).toBuffer();
        // return sharp(buffer).toFile(`${title}.${type}`);
        return buffer;
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
        // return Photos.insertMany( format( files, albumId ) );
    }

    private optimizePhotos( files ) {
        let fileName;
        let file;
        for ( let i in files ) {
            fileName = files[ i ].path.match( /[a-z0-9_.]+$/i ).toString();
            file = fs.readFileSync( path.join( globalAny.appRoot, `/pictures/raw/${fileName}` ) );

            sharp( file ).toFile( path.join( globalAny.appRoot, `/pictures/webp/${fileName}.webp` ) );
            sharp( file ).toFile( path.join( globalAny.appRoot, `/pictures/jpeg/${fileName}.jpeg` ) );

            sharp( file )
                .resize( null, 300 )
                .toFile( path.join( globalAny.appRoot, `/pictures/webp/preview_${fileName}.webp` ) );
            sharp( file )
                .resize( null, 300 )
                .toFile( path.join( globalAny.appRoot, `/pictures/jpeg/preview_${fileName}.jpeg` ) );
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
