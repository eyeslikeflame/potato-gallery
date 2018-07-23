import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { MDCSnackbar } from '@material/snackbar';

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
    public active = [];
    private files;
    public title = '';
    public loading = false;
    public loadedPhotos = [];
    public albumId = null;
    public showDropOff = false;
    public fileInput: any;
    public fullSize = {};
    public snackbar;

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
        const droppedFiles = e.dataTransfer.files || e.target.files;
        const validate = this.validateFiles( droppedFiles );
        if ( !validate.valid ) {
            alert( validate.message );
            return false;
        }
        this.fileInput.files = droppedFiles;
        this.load( this.fileInput.files );
    }

    private validateFiles( fileList: FileList ) {
        let status = {
            valid: true,
            message: ''
        };
        for ( let i = 0; i < fileList.length; i++ ) {
            if ( fileList[i].type !== 'image/jpeg' ) {
                status.valid = false;
                status.message = 'JPEG format only is allowed';
                break;
            }
            if ( fileList[i].size > 5000000) {
                status.valid = false;
                status.message = '5 MB is the max size for each file';
                break;
            }
        }
        return status;
    }

    constructor( private photosService: PhotosService,
                 private route: ActivatedRoute,
                 private router: Router,
                 private titleService: Title,
                 public appService: AppService ) {
    }

    ngOnInit() {
        this.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        const textField = new MDCTextField( document.querySelector( '.mdc-text-field' ) );
        MDCRipple.attachTo( document.querySelector( '.mdc-button' ) );

        this.titleService.setTitle( '🥔 Album | Gallery' );
        this.appService.title = 'Album';

        this.fileInput = document.querySelector( '#file' );
       
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
        this.appService.removeData();
    }

    public photoClick( index, photo? ) {
        if ( !this.appService.isSelected ) {
            this.fullSize = photo;
        } else {
            this.appService.selectToggle( index, photo._id );

        }
    }

    public fabAction() {
        if ( this.appService.isSelected ) {
            this.appService.deletePhotos(this.albumId).subscribe( (deleted: any) => {
                for (let i = 0; i < this.appService.album.photos.length; i++) {
                    if ( this.appService.selected[i] ) {
                        delete this.appService.album.photos[i];
                    }
                }
                const dataObj = {
                    message: deleted.message,
                    actionText: 'Cool',
                    actionHandler: function () {
                        alert('cool');
                    }
                };
                  
                this.snackbar.show(dataObj);
                this.appService.clearSelection();
            });
           
        } else {
            const input: HTMLInputElement = document.querySelector('#file');
            input.click();
        }
    }

    public save() {
        this.loading = true;
        const title = this.title || 'Untitled';

        if ( this.albumId ) {
            return this.photosService.saveAlbum( { title: title }, this.files, this.albumId ).subscribe( ( album: any ) => {
                this.loading = false;
                const dataObj = {
                    message: album.message,
                    actionText: 'Cool',
                    actionHandler: function () {
                        alert('cool');
                    }
                };
                  
                this.snackbar.show(dataObj);
            } );
        }

        this.titleService.setTitle( `${this.title || 'Album'} | Gallery` );
        this.photosService.saveAlbum( { title: title }, this.files ).subscribe( ( album: any ) => {
            this.loading = false;
            this.router.navigate( [ '/album', album.id ] );
           
        } );
    }

    public load( files ) {
        const _this = this;
        this.files = files;
        this.imgArray = [];
        const validate = this.validateFiles( files );
        if ( !validate.valid ) {
            alert(validate.message)
            return false;
        }
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
