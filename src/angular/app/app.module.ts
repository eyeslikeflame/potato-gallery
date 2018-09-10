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
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule( {
    declarations: [
        AppComponent,
        PhotosComponent,
        GalleryComponent,
        SearchBarComponent
    ],
    imports:      [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
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
