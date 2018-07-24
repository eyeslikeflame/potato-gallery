import { Albums } from '../models/albums.model';
import { Photos } from '../models/photos.model';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as formidable from 'formidable';
import * as path from 'path';
import { photos } from '../routes/photos';
import { resolve } from 'dns';

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
        form.hash = 'md5';
        form.keepExtensions = true;
        form.uploadDir = path.join( globalAny.appRoot, '/pictures' );
        const parsed = await form.parse( request, ( err, fields, files ) => {
            this.update( files, fields.title, request.params.id ).then( ( album: any ) => {
                this.getAlbum( request, response, album._id);
                // response.json( {
                //     id:      album._id,
                //     message: 'Album is successfully saved'
                // } );
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
        return Albums.create( { 
            
        } ).then( album => {
            response.json( {
                id:      album._id,
                message: 'Album is successfully created'
            } );
        });
    }

    private async update( files, title, id ) {
        return new Promise( (resolve, reject) => {
            Albums.findOneAndUpdate( {
                _id: new Types.ObjectId( id )
            }, {
                title: title
            }, {
                upsert: true, 'new': true
            } ).then( updated => {
                if ( files && files[ 0 ] ) {
                    Photos.insertMany( this.format( files, updated._id ) ).then( photos => {
                        if ( !updated.preview && photos[ 0 ] ) {
                            Albums.update( {
                                _id: updated._id
                            }, {
                                $set: {
                                    preview: photos[ 0 ]._id
                                }
                            } ).then();
                        }
                        resolve(updated);
                    } );
                   
                }
                
            } );
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
