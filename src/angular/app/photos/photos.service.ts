import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class PhotosService {

    constructor( private http: Http ) {
    }

    public saveAlbum( files, body ) {
        const formData: FormData = new FormData();
        formData.append('fileKey', files, body);
        return this.http.post( '/api/albums/new-album/save', formData ).pipe( map( res => res.json() ) );
    }

}
