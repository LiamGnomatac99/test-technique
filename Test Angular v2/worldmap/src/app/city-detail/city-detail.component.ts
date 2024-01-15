import { Component, OnInit } from '@angular/core';
import { CITIES } from '../../mock-cities';
import { City } from './city';
@Component({
    selector: 'app-city-detail',
    templateUrl: './city-detail.component.html',
    styleUrls: ['./city-detail.component.css']
})

export class CityDetailComponent implements OnInit {
    data: City[] = [];
    constructor() {

    }

    ngOnInit() {
        this.data = CITIES;
    }
}