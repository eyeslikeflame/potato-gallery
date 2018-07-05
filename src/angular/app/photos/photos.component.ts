import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { PhotosService } from './photos.service';

@Component( {
    selector:    'app-photos',
    templateUrl: './photos.component.html',
    styleUrls:   [ './photos.component.scss' ],
    providers:   [ PhotosService ]
} )
export class PhotosComponent implements OnInit {
    public imgArray = [];
    public album;
    private files;
    title = '';
    constructor( private photosService: PhotosService, private route: ActivatedRoute ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe( query => {
            if (query.id) {
                this.photosService.getAlbum(query.id).subscribe( album => {
                    this.album = album;
                });
            }
        });
    }

    save() {
        const title = this.title || 'Untitled';
        this.photosService.saveAlbum( { title: title }, this.files ).subscribe(albums => {});
    }

    load(files) {
        const _this = this;
        this.files = files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

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
