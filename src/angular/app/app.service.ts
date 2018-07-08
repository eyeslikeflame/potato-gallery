import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { map } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root'
} )
export class AppService {

    constructor(private http: HttpClient) {
    }
    public selected = {};
    public isSelected = false;

    public title = '';

    public checkIfSelected() {
        this.isSelected = Object.keys(this.selected).length > 0;
    }

    public deleteItems() {
        return this.http.post(`/api/albums/delete/`, this.selected);
    }
}
