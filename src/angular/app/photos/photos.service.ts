import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class PhotosService {

    constructor( private http: Http ) {
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
            return this.http.patch( `/api/albums/update/${id}`, formData ).pipe( map( res => res.json() ) );
        }

        return this.http.post( '/api/albums/new-album/save', formData ).pipe( map( res => res.json() ) );
    }

}
