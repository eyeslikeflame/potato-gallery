import { model, Schema } from 'mongoose';

const albumsSchema: Schema = new Schema({
    title: String,
    previews: Array,
    fav: Boolean,
    onwer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, { versionKey: false });

export const Albums = model( 'albums', albumsSchema );
