import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';

import { AppService } from '../app.service';
import { PhotosService } from './photos.service';

@Component( {
    selector:    'app-photos',
    templateUrl: './photos.component.html',
    styleUrls:   [ './photos.component.scss' ],
    providers:   [ PhotosService ]
} )
export class PhotosComponent implements OnInit, OnDestroy {
    public imgArray = [];
    active = [];
    private files;
    title = '';
    loading = false;
    loadedPhotos = [];
    albumId = null;

    constructor( private photosService: PhotosService,
                 private route: ActivatedRoute,
                 private router: Router,
                 private titleService: Title,
                 public appService: AppService ) {
    }

    ngOnInit() {
        this.titleService.setTitle( 'Album | Gallery' );
        this.appService.title = 'Album';
        const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
        MDCRipple.attachTo(document.querySelector('.mdc-button'));
        MDCRipple.attachTo(document.querySelector('label.mdc-button'));
        this.route.params.subscribe( params => {
            if ( params.id ) {
                this.albumId = params.id;
                this.appService.getAlbum( params.id ).subscribe( ( album: any ) => {
                    this.appService.album = album;
                    this.title = album.title;
                    this.titleService.setTitle( `${album.title || 'Album'} | Gallery` );
                } );
            }
        } );
    }

    ngOnDestroy() {
        this.appService.clearSelection();
    }

    public save() {
        this.loading = true;
        const title = this.title || 'Untitled';

        if ( this.albumId ) {
            return this.photosService.saveAlbum( { title: title }, this.files, this.albumId ).subscribe( album => {
                this.loading = false;
            } );
        }

        this.titleService.setTitle( `${this.title || 'Album'} | Gallery` );
        this.photosService.saveAlbum( { title: title }, this.files ).subscribe( album => {
            this.loading = false;
            this.router.navigate( [ '/album', album.id ] );
        } );
    }

    public load( files ) {
        const _this = this;
        this.files = files;
        this.imgArray = [];
        for ( let i = 0; i < files.length; i++ ) {
            const reader = new FileReader();
            _this.imgArray[ i ] = {
                src:   null,
                title: files[ i ].name.replace( /\.[a-zA-Z]+$/, '' )
            };
            reader.onload = ( event: any ) => {
                _this.imgArray[ i ] = {
                    src:   event.target.result,
                    title: files[ i ].name.replace( /\.[a-zA-Z]+$/, '' )
                };
            };

            reader.readAsDataURL( files[ i ] );
        }
    }

    public imgLoaded( event, i ) {
        this.imgLoaded[ i ] = true;
    }
}
