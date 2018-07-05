import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { PhotosService } from './photos.service';

@Component( {
    selector:    'app-photos',
    templateUrl: './photos.component.html',
    styleUrls:   [ './photos.component.scss' ],
    providers:   [ PhotosService ]
} )
export class PhotosComponent implements OnInit {
    public imgArray = [];
    active = [];
    public album;
    private files;
    title = '';
    loading = false;
    constructor( private photosService: PhotosService,
                 private route: ActivatedRoute,
                 private router: Router ) {
    }

    ngOnInit() {
        this.route.params.subscribe( params => {
            if (params.id) {
                this.photosService.getAlbum(params.id).subscribe( album => {
                    this.album = album;
                    this.title = album.title;
                });
            }
        });
    }

    save() {
        this.loading = true;
        const title = this.title || 'Untitled';
        this.photosService.saveAlbum( { title: title }, this.files ).subscribe(album => {
            this.loading = false;
            this.router.navigate(['/album', album.id])
        });
    }

    load(files) {
        const _this = this;
        this.files = files;
        this.imgArray = [];
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            _this.imgArray[i] = {
                src: null,
                title: files[i].name.replace(/\.[a-zA-Z]+$/, '')
            };
            console.log(files[i])
            reader.onload = (event: any) => {
                _this.imgArray[i] = {
                    src: event.target.result,
                    title: files[i].name.replace(/\.[a-zA-Z]+$/, '')
                };
            };

            reader.readAsDataURL(files[i]);
        }
    }
}
