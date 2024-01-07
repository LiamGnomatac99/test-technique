import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorldmapComponent } from './worldmap/worldmap.component';
import { CitiesComponent } from './cities/cities.component';
import { CityDetailComponent } from './city-detail/city-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/worldmap', pathMatch: 'full' },
  { path: 'worldmap', component: WorldmapComponent },
  { path: 'detail/:id', component: CityDetailComponent },
  { path: 'cities', component: CitiesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
