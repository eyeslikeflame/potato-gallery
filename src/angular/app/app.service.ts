import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable( {
    providedIn: 'root'
} )
export class AppService {

    constructor(private http: HttpClient) {
    }
    public selected = {};
    public isSelected = false;
    public title = '';
    public albums;
    public album;

    public checkIfSelected() {
        this.isSelected = Object.keys(this.selected).length > 0;
    }

    public deleteAlbums() {
        return this.http.post(`/api/albums/delete/`, this.selected);
    }

    public deletePhotos() {
        return this.http.post(`/api/photos/delete/`, this.selected);
    }

    public clearSelection() {
        this.selected = {};
        this.album = null;
        this.albums = null;
        this.checkIfSelected();
    }

    public selectToggle(index, id) {
        if (!this.selected[index]) {
            this.selected[index] = id;
        } else {
            delete this.selected[index];
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