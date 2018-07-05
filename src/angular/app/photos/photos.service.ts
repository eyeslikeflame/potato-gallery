import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class PhotosService {

    constructor( private http: Http ) {
    }

    public getAlbum(id) {
        return this.http.get( `/api/albums/${id}` ).pipe( map( res => res.json() ) );
    }

    public saveAlbum( body, files ) {
        const formData: FormData = new FormData();
        formData.append('title', body.title);

        for (let i = 0; i < files.length; i++) {
            formData.append( i.toString(), files[i], files[i]['name']);
        }

        return this.http.post( '/api/albums/new-album/save', formData ).pipe( map( res => res.json() ) );
    }

}
