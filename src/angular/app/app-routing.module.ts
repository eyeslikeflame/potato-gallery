import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';
import { GalleryComponent } from './gallery/gallery.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'gallery',
        pathMatch: 'full'
    },
    {
        path: 'gallery',
        component: GalleryComponent
    },
    {
        path: 'album',
        component: PhotosComponent
    }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {

}
