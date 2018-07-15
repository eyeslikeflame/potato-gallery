import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from './app.service';

@Component( {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   [ './app.component.scss' ]
} )
export class AppComponent {
    constructor( public router: Router, public appService: AppService) {

    }


    public deleteItems() {
        const path = this.router.url.match(/^\/[a-z]+/)[0];
        if ( path === '/gallery' ) {

        } else if ( path === '/album' ) {
            this.appService.deletePhotos().subscribe( deleted => {
                for (let i = 0; i < this.appService.album.photos.length; i++) {
                    if ( this.appService.selected[i] ) {
                        delete this.appService.album.photos[i];
                    }
                }
                console.log(this.appService.album.photos);
            });
        }
    }
}
