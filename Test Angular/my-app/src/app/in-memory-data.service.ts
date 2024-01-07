import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { City } from './city';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const cities = [
      { id: 1, country: 'France', name: 'Paris', population: 2.610, lat: 48.9, lng: 2.3 },
      { id: 2, country: 'United Kingdom', name: 'London', population: 8.982, lat: 51.5, lng: -0.1 },
      { id: 3, country: 'United States', name: 'Washington DC', population: 0.712, lat: 38.9, lng: -77.0 },
      { id: 4, country: 'Japan', name: 'Tokyo', population: 13.96, lat: 35.7, lng: 139.7 },
      { id: 5, country: 'Liberia', name: 'Monrovia', population: 1.022, lat: 6.3, lng: -10.8 }
    ];
    return { cities };
  }

  // Overrides the genId method to ensure that a city always has an id.
  // If the cities array is empty,
  // the method below returns the initial number (1).
  // if the heroes array is not empty, the method below returns the highest
  // city id + 1.
  genId(cities: City[]): number {
    return cities.length > 0 ? Math.max(...cities.map(city => city.id)) + 1 : 1;
  }
}