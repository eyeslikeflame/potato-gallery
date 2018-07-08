import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class GalleryService {

    constructor(private http: Http) { }

    public getAlbums() {
        return this.http.get( '/api/albums' ).pipe( map( res => res.json() ) );
    }
}
