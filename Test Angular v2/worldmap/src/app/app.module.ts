import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { WorldMapComponent } from './worldmap/worldmap.component';
// @NgModule decorator with its metadata
const appRoutes: Routes = [
    { path: 'cities', component: CityDetailComponent },
    { path: 'worldmap', component: WorldMapComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        FormsModule
    ],
    declarations: [
        AppComponent,
        CityDetailComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }