import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from "./app.service";

@Component( {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   [ './app.component.scss' ]
} )
export class AppComponent {
    constructor(public router: Router, public appService: AppService) {

    }

    public deleteItems() {
        this.appService.deleteItems().subscribe(deleted => {
            console.log(deleted);
        });
    }
}
