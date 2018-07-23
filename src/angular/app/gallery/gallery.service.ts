import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GalleryService {

    constructor( private http: HttpClient ) {
    }

    public createAlbum() {
        return this.http.post( '/api/albums/new-album/save', {} );
    }
}
