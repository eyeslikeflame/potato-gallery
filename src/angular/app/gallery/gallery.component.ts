import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from "../app.service";
import { GalleryService } from './gallery.service';

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

    public albums;

    ngOnInit() {
        this.titleService.setTitle( 'Gallery' );
        this.appService.title = 'Gallery';
        this.galleryService.getAlbums().subscribe( albums => this.albums = albums );
    }

    ngOnDestroy() {
        this.appService.clearSelection();
    }

    public favorite( id, index ) {
        this.galleryService.favorite( id ).subscribe( fav => {
            this.albums[index].favorite = fav;
        } );
    }
}
