import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule( {
    declarations: [
        AppComponent,
        PhotosComponent,
        GalleryComponent
    ],
    imports:      [
        HttpModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers:    [ ],
    bootstrap:    [ AppComponent ]
} )
export class AppModule {
}
