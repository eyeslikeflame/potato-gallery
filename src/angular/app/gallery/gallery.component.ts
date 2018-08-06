import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MDCRipple } from '@material/ripple';

import { AppService } from '../app.service';
import { GalleryService } from './gallery.service';
import { MobileService } from "../mobile.service";

@Component( {
    selector:    'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls:   [ './gallery.component.scss' ],
    providers:   [ GalleryService ]
} )
export class GalleryComponent implements OnInit, OnDestroy {

    constructor( private galleryService: GalleryService,
                 private titleService: Title,
                 public appService: AppService,
                 private router: Router,
                 public mobileService: MobileService) {
    }

    ngOnInit() {
        this.titleService.setTitle( '🥔 Gallery' );
        this.appService.title = 'Gallery';
        this.appService.getAlbums().subscribe( albums => this.appService.albums = albums );
        const fabRipple = new MDCRipple( document.querySelector( '.mdc-fab' ) );
    }

    ngOnDestroy() {
        this.appService.removeData();
    }

    public albumClick( index, id ) {
        if ( this.appService.isSelected ) {
            this.appService.selectToggle( index, id );
        } else {
            this.router.navigate( [ '/album', id ] )
        }
    }

    public longPress( index, id ) {
        if ( this.mobileService.isMobile ) {
            this.appService.selectToggle( index, id );
            return false;
        }
    }

    public favorite( id, index ) {
        this.appService.favorite( id ).subscribe( fav => {
            this.appService.albums[ index ].favorite = fav;
        } );
    }

    public fabAction() {
        if ( this.appService.isSelected ) {
            this.appService.deleteAlbums().subscribe( deleted => {
                this.appService.albums = this.appService.albums.map( ( el, i ) => {
                    if ( this.appService.selected[ i ] ) {
                        return null;
                    }
                    return el;
                } );
                this.appService.clearSelection();
            } );
        } else {
            this.galleryService.createAlbum().subscribe( ( album : any ) => {
                this.router.navigate( [ '/album', album.id ] );
            } );
        }
    }
}
