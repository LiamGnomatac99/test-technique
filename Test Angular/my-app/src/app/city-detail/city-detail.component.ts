import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { City } from '../city';
import { CityService } from '../city.service';

@Component({
    selector: 'app-city-detail',
    templateUrl: './city-detail.component.html',
    styleUrls: ['./city-detail.component.css']
})
export class CityDetailComponent implements OnInit {
    city: City | undefined;

    constructor(
        private route: ActivatedRoute,
        private cityService: CityService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getCity();
    }

    getCity(): void {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        this.cityService.getCity(id)
            .subscribe(city => this.city = city);
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        if (this.city) {
            this.cityService.updateCity(this.city)
                .subscribe(() => this.goBack());
        }
    }
}
