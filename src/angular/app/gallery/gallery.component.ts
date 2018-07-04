import { Component, OnInit } from '@angular/core';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [ GalleryService ]
})
export class GalleryComponent implements OnInit {

    constructor( private galleryService: GalleryService ) { }

    public albums = [];

    ngOnInit() {
        this.galleryService.getAlbums().subscribe(albums => this.albums = albums);
    }

}
