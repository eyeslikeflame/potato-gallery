import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AppService } from "./app.service";
import { MobileService } from "./mobile.service";

@NgModule( {
    declarations: [
        AppComponent,
        PhotosComponent,
        GalleryComponent
    ],
    imports:      [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers:    [
        AppService,
        Title,
        MobileService
    ],
    bootstrap:    [ AppComponent ]
} )
export class AppModule {
}
