import { model, Schema } from 'mongoose';

const photosSchema: Schema = new Schema( {
    title:    String,
    src: String,
    album:    {
        type: Schema.Types.ObjectId,
        ref:  'users'
    }
}, { versionKey: false } );

export const Photos = model( 'photos', photosSchema );
