import { Component, OnInit } from '@angular/core';
import { PhotosService } from './photos.service';

@Component( {
    selector:    'app-photos',
    templateUrl: './photos.component.html',
    styleUrls:   [ './photos.component.scss' ],
    providers:   [ PhotosService ]
} )
export class PhotosComponent implements OnInit {
    public imgArray = [];
    private files;
    constructor( private photosService: PhotosService ) {
    }

    ngOnInit() {
    }

    save() {
        this.photosService.saveAlbum( { title: 'ololol' }, this.files ).subscribe(albums => {});
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
                }
            };

            reader.readAsDataURL(files[i]);
        }
        // this.imgArray = files;
        console.log(files)
    }
}
