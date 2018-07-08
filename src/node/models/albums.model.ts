import { model, Schema } from 'mongoose';

const albumsSchema: Schema = new Schema( {
    title:    String,
    preview:    {
        type: Schema.Types.ObjectId,
        ref:  'photos'
    },
    favorite:      Boolean,
    owner:    {
        type: Schema.Types.ObjectId,
        ref:  'users'
    }
}, { versionKey: false } );

export const Albums = model( 'albums', albumsSchema );
