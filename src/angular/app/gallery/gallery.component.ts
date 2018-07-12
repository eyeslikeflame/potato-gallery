import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from '../app.service';
import { GalleryService } from './gallery.service';
import { MDCRipple } from '@material/ripple';

@Component( {
    selector:    'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls:   [ './gallery.component.scss' ],
    providers:   [ GalleryService ]
} )
export class GalleryComponent implements OnInit, OnDestroy {

    constructor( private galleryService: GalleryService,
                 private titleService: Title,
                 public appService: AppService ) {
    }

    ngOnInit() {
        this.titleService.setTitle( '🥔 Gallery' );
        this.appService.title = 'Gallery';
        this.appService.getAlbums().subscribe( albums => this.appService.albums = albums );
        const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'));
    }

    ngOnDestroy() {
        this.appService.clearSelection();
    }

    public favorite( id, index ) {
        this.appService.favorite( id ).subscribe( fav => {
            this.appService.albums[index].favorite = fav;
        } );
    }
}
