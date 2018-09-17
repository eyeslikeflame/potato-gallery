import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { MDCSnackbar } from '@material/snackbar';

import { AppService } from '../app.service';
import { PhotosService } from './photos.service';
import { MobileService } from "../mobile.service";

@Component( {
    selector:    'app-photos',
    templateUrl: './photos.component.html',
    styleUrls:   [ './photos.component.scss' ],
    providers:   [ PhotosService ]
} )
export class PhotosComponent implements OnInit, OnDestroy {
    public active = [];
    private files;
    public title = '';
    public loadedPhotos = [];
    public albumId = null;
    public showDropOff = false;
    public fileInput: any;
    public fullSize: any = {};
    public snackbar;
    public uploading = 0;
    public uploadingDone = false;
    public uploadingError: any = null;

    constructor( private photosService: PhotosService,
                 private route: ActivatedRoute,
                 private titleService: Title,
                 public appService: AppService,
                 public mobileService: MobileService ) {
    }

    @HostListener( 'dragover', [ "$event" ] )
    @HostListener( 'dragenter', [ "$event" ] )
    dragover( e ) {
        e.preventDefault();
        e.stopPropagation();
        this.showDropOff = true;
    }

    dragend( e ) {
        e.preventDefault();
        e.stopPropagation();
        this.showDropOff = false;
    }

    @HostListener( 'drop', [ "$event" ] )
    drop( e ) {
        e.preventDefault();
        e.stopPropagation();
        this.showDropOff = false;
        if ( this.uploading ) {
            return false;
        }
        const droppedFiles = e.dataTransfer.files || e.target.files;
        const validate = this.validateFiles( droppedFiles );
        if ( !validate.valid ) {
            alert( validate.message );
            return false;
        }
        this.fileInput.files = droppedFiles;
        if ( navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1 ) {
            this.load( this.fileInput.files );
        }

    }

    private validateFiles( fileList: FileList ) {
        let status = {
            valid:   true,
            message: ''
        };
        for ( let i = 0; i < fileList.length; i++ ) {
            if ( fileList[ i ].type !== 'image/jpeg' ) {
                status.valid = false;
                status.message = 'JPEG format only is allowed';
                break;
            }
            if ( fileList[ i ].size > 5000000 ) {
                status.valid = false;
                status.message = '5 MB is the max size for each file';
                break;
            }
        }
        return status;
    }


    ngOnInit() {
        this.snackbar = new MDCSnackbar( document.querySelector( '.mdc-snackbar' ) );
        const textField = new MDCTextField( document.querySelector( '.mdc-text-field' ) );

        this.titleService.setTitle( '🥔 Album | Gallery' );
        this.appService.title = 'Album';

        this.fileInput = document.querySelector( '#file' );
        const title = document.getElementById( 'title' );

        // todo refactor
        this.route.params.subscribe( params => {
            if ( params.id ) {
                this.albumId = params.id;
                this.appService.getAlbum( params.id ).subscribe( ( album: any ) => {
                    this.appService.album = album;
                    this.title = album.title;
                    this.titleService.setTitle( `${album.title || 'Album'} | Gallery` );
                    this.photosService.debounceSave( title, this.albumId ).subscribe( data => {
                        console.log( data )
                    } );
                } );
            }
        } );
    }

    ngOnDestroy() {
        this.appService.removeData();
    }

    public photoClick( index, photo? ) {
        if ( !this.appService.isSelected ) {
            this.fullSizeToggle( photo, index );
        } else {
            this.appService.selectToggle( index, photo._id );
        }
    }

    public longPress( index, id ) {
        if ( this.mobileService.isMobile ) {
            this.appService.selectToggle( index, id );
            return false;
        }
    }

    public fullSizeToggle( photo?, index? ) {
        if ( this.fullSize.src ) {
            this.fullSize = {};
        } else {
            this.fullSize = photo;
            this.fullSize.$index = index;
            setTimeout( () => {
                //ikr, but this is needed for arrows to work
                (<any>document.querySelector( '.full-size' )).focus();
            } )
        }
        document.body.classList.toggle( 'full-size-photo' );
    }

    public fabAction() {
        if ( this.uploading ) {
            return false;
        }
        if ( this.appService.isSelected ) {
            this.appService.deletePhotos( this.albumId ).subscribe( ( deleted: any ) => {
                for ( let i = 0; i < this.appService.album.photos.length; i++ ) {
                    if ( this.appService.selected[ i ] ) {
                        delete this.appService.album.photos[ i ];
                    }
                }
                const dataObj = {
                    message:       deleted.message,
                    actionText:    'Cool',
                    actionHandler: function () {
                        alert( 'cool' );
                    }
                };

                this.snackbar.show( dataObj );
                this.appService.clearSelection();
            } );

        } else {
            const input: HTMLInputElement = document.querySelector( '#file' );
            input.click();
        }
    }

    public save() {
        this.uploading = this.files.length;
        const animation = this.uploadAnimation();
        animation.start();
        return this.photosService.saveAlbum( this.files, this.albumId ).subscribe( ( album: any ) => {
            animation.finish().then( _ => {
                this.appService.album = album;
                this.snackbar.show( dataObj );
                return _;
            } ).then( _ => {
                this.fileInput.value = '';
            } );
            const dataObj = {
                message:       `Successfully added ${this.files.length} photo${this.files.length > 1 ? 's' : ''}`,
                actionText:    'Cool',
                actionHandler: () => {
                    alert( 'cool' );
                }
            };
        } );
    }

    public load( files ) {
        this.files = files;
        const validate = this.validateFiles( files );
        if ( !validate.valid ) {
            alert( validate.message );
            return false;
        }

        this.save();
    }

    public imgLoaded( event, i ) {
        this.imgLoaded[ i ] = true;
    }

    private uploadAnimation() {
        let circle: any;
        const _this = this;
        setTimeout( () => {
            circle = document.querySelector( '.circle' );
            circle.classList.remove( 'finished' );
        }, 0 );

        function start() {
            setTimeout( () => {
                circle.classList.add( 'unfinished' );
            }, 0 );
        }

        async function finish() {
            circle.classList.remove( 'unfinished' );
            circle.classList.add( 'finished' );
            return await new Promise( resolve => {
                setTimeout( () => {
                    _this.uploading = 0;
                    circle.classList.remove( 'finished' );
                    resolve( true );
                }, 1150 );
            } )
        }

        return {
            start:  start,
            finish: finish
        }
    }

    public slide( i, event? ) {
        if ( event && event.key === 'ArrowLeft' ) {
            i  = -1;
        } else if ( event && event.key === 'ArrowRight' ) {
            i  = 1;
        }

        let newIndex = this.fullSize.$index + i;
        if ( newIndex < 0 ) {
            newIndex = this.appService.album.photos.length - 1;
        } else if ( newIndex >= this.appService.album.photos.length ) {
            newIndex = 0;
        }
        this.fullSize = this.appService.album.photos[ newIndex ];
        this.fullSize.$index = newIndex;
    }
}
