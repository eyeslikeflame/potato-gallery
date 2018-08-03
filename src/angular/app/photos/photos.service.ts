import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class PhotosService {

    constructor( private http: HttpClient ) {
    }


    public saveAlbum( files, id = null ) {
        const formData: FormData = new FormData();
        if ( files && files[ 0 ] ) {
            for ( let i = 0; i < files.length; i++ ) {
                formData.append( i.toString(), files[ i ], files[ i ][ 'name' ] );
            }
        }

        return this.http.patch( `/api/albums/update/${id}`, formData );
    }

    public debounceSave(input, id) {
        return fromEvent(input, 'input').pipe(
            map((e: any) => e.target.value),
            filter(text => text.length > 2),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((value) => this.http.patch( `/api/albums/update/${id}/title`, {title: value} ))
        );
    }

}
