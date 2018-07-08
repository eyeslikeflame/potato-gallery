import { model, Schema } from 'mongoose';

const photosSchema: Schema = new Schema( {
    title:    String,
    src: String,
    uploadDate: Date,
    album:    {
        type: Schema.Types.ObjectId,
        ref:  'album'
    }
}, { versionKey: false } );

export const Photos = model( 'photos', photosSchema );
