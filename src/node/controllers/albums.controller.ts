import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';
import * as rimraf from 'rimraf';

import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';

import { photos } from '../routes/photos';

import PhotosController from './photos.controller';

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class AlbumsController {
    private photosController: PhotosController;

    constructor() {
        this.photosController = new PhotosController();
    }

    public getAlbums( request, response ) {
        Albums.aggregate( [
            {
                $sort: {
                    favorite: -1
                }
            },
            {
                $lookup: {
                    from:         'photos',
                    localField:   'preview',
                    foreignField: '_id',
                    as:           'preview'
                }
            },
            {
                $project: {
                    preview:  {
                        $arrayElemAt: [ '$preview', 0 ]
                    },
                    title:    1,
                    favorite: 1
                },

            }
        ] ).then( albums => {
            albums.map( el => {
                if ( el.preview ) {
                    el.preview = `/api/photos/get-photo/${el.preview.src}`;
                } else {
                    el.preview = null;
                }

                return el;
            } );
            response.json( albums );
        } );
    }

    public getAlbum( request, response, id = null ) {
        Albums.aggregate( [
            {
                $match: {
                    _id: new Types.ObjectId( id || request.params.id )
                }
            },
            {
                $lookup: {
                    from:         'photos',
                    localField:   '_id',
                    foreignField: 'album',
                    as:           'photos'
                }
            },
            {
                $unwind: {
                    'path':                       '$photos',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                $sort: {
                    'photos.uploadDate': -1
                }
            },
            {
                $group: {
                    _id:      '$_id',
                    'photos': {
                        $push: '$photos'
                    },
                    title:    {
                        $first: '$title'
                    }
                }
            }
        ] ).then( album => {
            album[ 0 ].photos.map( el => {
                el.src = `/api/photos/get-photo/${el.src}`;
                return el;
            } );
            response.json( album[ 0 ] );
        } ).catch( err => {
            console.log( err );
        } );
    }

    public async saveAlbum( request, response, update = false ) {
        const form = new formidable.IncomingForm();
        form.multiple = true;
        form.keepExtensions = false;
        form.uploadDir = path.join( globalAny.appRoot, '/pictures/raw' );
        const parsed = await form.parse( request, ( err, fields, files ) => {
            console.log( files );

            this.update( files, request.params.id ).then( ( album: any ) => {
                this.getAlbum( request, response, album._id );
            } ).catch( err => {
                response.status( 500 ).json( 'There was a problem with saving an album' );
            } );
        } );

    }

    public async deleteAlbums( request, response ) {
        const albums = Object.values( request.body );
        Albums.find( {
            _id: {
                $in: albums
            }
        } ).then( albums => {
            Photos.find( {
                album: {
                    $in: albums
                }
            } ).then( photos => {
                photos.map( el => {
                    rimraf( path.join( globalAny.appRoot, `/pictures`, el.src ), () => {} );
                } );
                Photos.remove( {
                    album: {
                        $in: albums
                    }
                } ).then();
                Albums.remove( {
                    _id: {
                        $in: albums
                    }
                } ).then();
                response.json( {
                    success: true,
                    message: `Successfully deleted ${albums.length} album${albums.length > 1 ? 's' : ''}`
                } );
            } );

        } );
    }

    public favoriteAlbum( request, response ) {
        Albums.findOne( {
            _id: request.params.id
        } ).then( album => {
            Albums.update( {
                _id: request.params.id
            }, {
                $set: {
                    favorite: !album.favorite
                }
            } ).then( _ => {
                response.json( !album.favorite );
            } ).catch( err => {
                console.log( err );
            } );
        } );
    }

    public create( request, response ) {
        return Albums.create( {} ).then( album => {
            response.status( 201 ).json( {
                id:      album._id,
                message: 'Album is successfully created'
            } );
        } );
    }

    private async update( files, id ) {
        return new Promise( ( resolve, reject ) => {
            Albums.find( {
                _id: new Types.ObjectId( id )
            } ).then( album => {
                if ( files && files[ 0 ] ) {
                    this.photosController.savePhotos( files, id ).then( photos => {
                        Albums.update( {
                            _id: new Types.ObjectId( id )
                        }, {
                            $set: {
                                preview: photos[ 0 ]._id
                            }
                        } ).then();
                        resolve( album );
                    } );
                } else {
                    reject( 'No files were provided' )
                }

            } );
        } )
    }

    public async updateTitle( request, response ) {
        return Albums.update( {
            _id: new Types.ObjectId( request.params.id )
        }, {
            $set: {
                title: request.body.title
            }
        } ).then( updated => {
            response.json( true );
        } ).catch( error => {
            response.status( 500 ).json( {
                err:     error,
                message: 'Title was not saved properly'
            } )
        } )
    }

    private format( files, id, ) {
        const temp = [];
        for ( let i in files ) {
            temp.push( {
                title:      files[ i ].name,
                src:        files[ i ].path.match( /[a-z0-9_.]+$/i ),
                album:      new Types.ObjectId( id ),
                uploadDate: new Date(),
            } );
        }
        return temp;
    }
}

export default AlbumsController;
