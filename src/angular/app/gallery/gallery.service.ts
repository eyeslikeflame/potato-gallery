import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class GalleryService {

    constructor( private http: HttpClient ) {
    }

    public getAlbums() {
        return this.http.get( '/api/albums' );
    }

    public favorite( id ) {
        return this.http.patch( `/api/albums/favorite/${id}`, {} );
    }
}
