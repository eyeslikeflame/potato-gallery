import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';
import { photos } from "../routes/photos";

const globalAny: any = global;
globalAny.appRoot = process.cwd();

class AlbumsController {
    constructor() {

    }

    public getAlbums( request, response ) {
        Albums.aggregate( [
            {
                $sort: {
                    favorite: -1
                }
            }
        ] ).then( albums => {
            response.json( albums );
        } );
    }

    public getAlbum( request, response ) {
        Albums.aggregate( [
            {
                $match: {
                    _id: new Types.ObjectId( request.params.id )
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
                $unwind: '$photos'
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
                    }
                }
            }
        ] ).then( album => {
            album[ 0 ].photos.map( el => {
                el.src = `/api/photos/get-photo/${el.src}`;
                return el;
            } );
            response.json( album[ 0 ] );
        } );
    }

    public async saveAlbum( request, response, update = false ) {
        const form = new formidable.IncomingForm();
        form.multiple = true;
        form.hash = 'md5';
        form.keepExtensions = true;
        form.uploadDir = path.join( globalAny.appRoot, '/pictures' );
        const parsed = await form.parse( request, ( err, fields, files ) => {
            if ( !update ) {
                this.create( files, fields.title ).then( album => {
                    response.json( {
                        id:      album._id,
                        message: 'Album is successfully created'
                    } );
                } ).catch( err => {
                    response.status( 500 ).json( 'There was a problem with saving an album' );
                } );
            } else {
                this.update( files, fields.title, request.params.id ).then( album => {
                    response.json( {
                        id:      album._id,
                        message: 'Album is successfully saved'
                    } );
                } ).catch( err => {
                    response.status( 500 ).json( 'There was a problem with saving an album' );
                } );
            }
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
                    fs.unlink( path.join( globalAny.appRoot, '/pictures', el.src ), ( err ) => {
                        if ( err ) {
                            response.json( err );
                        }
                        console.log( 'deleted' );
                    } );
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
            } )

        } )
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
                response.json(!album.favorite)
            } ).catch( err => {
                console.log( err );
            } )
        } )
    }

    private async create( files, title ) {
        return await Albums.create( {
            title: title
        } ).then( album => {
            Photos.insertMany( this.formatAndSaveFiles( files, album._id ) ).then( photos => {
            } );
            return album;
        } );
    }

    private async update( files, title, id ) {
        return await Albums.findOneAndUpdate( {
            _id: new Types.ObjectId( id )
        }, {
            title: title
        }, {
            upsert: true, new: true
        } ).then( updated => {
            Photos.insertMany( this.formatAndSaveFiles( files, updated._id ) ).then( photos => {
            } );
            return updated;
        } );
    }

    private formatAndSaveFiles( files, id ) {
        const temp = [];
        for ( let i in files ) {
            temp.push( {
                title:      files[ i ].name,
                src:        files[ i ].path.match( /[a-z0-9_.]+$/i ),
                album:      new Types.ObjectId( id ),
                uploadDate: new Date()
            } );
        }
        return temp;
    }
}

export default AlbumsController;
