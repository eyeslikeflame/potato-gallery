import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AppService } from "./app.service";
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule( {
    declarations: [
        AppComponent,
        PhotosComponent,
        GalleryComponent,
        SafeHtmlPipe
    ],
    imports:      [
        HttpModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers:    [
        AppService,
        Title
    ],
    bootstrap:    [ AppComponent ]
} )
export class AppModule {
}
