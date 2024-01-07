import { Component, OnInit } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { City } from '../city';
import { CityService } from '../city.service';

@Component({
    selector: 'app-worldmap',
    templateUrl: './worldmap.component.html',
    styleUrls: ['./worldmap.component.css']
})



export class WorldmapComponent implements OnInit {
    display: any;
    zoom = 12;
    center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };

    cities: City[] = [];
    constructor(private cityService: CityService) { }
    ngOnInit() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });
        this.getCities();
    }
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null)
            this.center = (event.latLng.toJSON());
    }

    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null)
            this.display = event.latLng.toJSON();
    }

    getCities(): void {
        this.cityService.getCities()
            .subscribe(cities => this.cities = cities.slice(1, 5));
    }

}

