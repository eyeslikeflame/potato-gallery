import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( {
    providedIn: 'root'
} )
export class PhotosService {

    constructor( private http: HttpClient ) {
    }


    public saveAlbum( body, files, id = null ) {
        const formData: FormData = new FormData();
        formData.append( 'title', body.title );

        if ( files && files[ 0 ] ) {
            for ( let i = 0; i < files.length; i++ ) {
                formData.append( i.toString(), files[ i ], files[ i ][ 'name' ] );
            }
        }


        if ( id ) {
            return this.http.patch( `/api/albums/update/${id}`, formData );
        }

        return this.http.post( '/api/albums/new-album/save', formData );
    }

}
