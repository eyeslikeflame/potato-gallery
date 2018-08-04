import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from './app.service';
import { MobileService } from "./mobile.service";

@Component( {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {
    constructor( public router: Router,
                 public appService: AppService,
                 public mobileService: MobileService) {

    }

    public deleteItems() {
        const path = this.router.url.match( /^\/[a-z]+/ )[ 0 ];
    }

    ngOnInit() {
        this.mobileService.check();
    }
}
