import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { SwUpdate } from "@angular/service-worker";

@Injectable( {
    providedIn: 'root'
} )
export class AppService {

    constructor( private http: HttpClient,
                  private meta: Meta,
                  private updates: SwUpdate) {
        updates.available.subscribe(event => {
            updates.activateUpdate().then(() => document.location.reload());
        });
    }

    public selected = {};
    public isSelected = 0;
    public title = '';
    public albums;
    public album;

    public checkIfSelected() {
        this.isSelected = Object.keys( this.selected ).length;
        if ( this.isSelected ) {
            this.meta.updateTag( { name: 'theme-color', content: '#6200EE' } );
        } else {
            this.meta.updateTag( { name: 'theme-color', content: '#3126FF' } );
        }
    }

    public deleteAlbums() {
        return this.http.post( `/api/albums/delete/`, this.selected );
    }

    public deletePhotos( id ) {
        return this.http.post( `/api/photos/delete/${id}`, this.selected );
    }

    public clearSelection() {
        this.selected = {};
        this.checkIfSelected();
    }

    public removeData() {
        this.album = null;
        this.albums = null;
        this.clearSelection()
    }

    public selectToggle( index, id ) {
        if ( !this.selected[ index ] ) {
            this.selected[ index ] = id;
        } else {
            delete this.selected[ index ];
        }
        this.checkIfSelected();
    }

    public getAlbums() {
        return this.http.get( '/api/albums' );
    }

    public getAlbum( id ) {
        return this.http.get( `/api/albums/${id}` );
    }

    public favorite( id ) {
        return this.http.patch( `/api/albums/favorite/${id}`, {} );
    }
}
