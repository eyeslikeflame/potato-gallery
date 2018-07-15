import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GalleryService {

    constructor( private http: HttpClient ) {
    }
}
