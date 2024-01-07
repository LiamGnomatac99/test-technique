import { Component, OnInit } from '@angular/core';

import { City } from '../city';
import { CityService } from '../city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];

  constructor(private cityService: CityService) { }

  ngOnInit(): void {
    this.getCities();
  }

  getCities(): void {
    this.cityService.getCities()
      .subscribe(cities => this.cities = cities);
  }

  add(name: string,country: string, population: number, lat: number, lng: number): void {
    name = name.trim();
    country = country.trim();
    if (!name || !population || !country || !lat || !lng) { return; }
    this.cityService.addCity({ name } as City)
      .subscribe(city => {
        this.cities.push(city);
      });
  }

  delete(city: City): void {
    this.cities = this.cities.filter(h => h !== city);
    this.cityService.deleteCity(city.id).subscribe();
  }

}