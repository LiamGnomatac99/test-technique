import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { } from 'googlemaps';
import { CITIES } from '../../mock-cities';
@Component({
    selector: 'worldmap',
    templateUrl: './worldmap.component.html',
    styleUrls: ['./worldmap.component.css']
})

export class WorldMapComponent implements AfterViewInit {
    @ViewChild('map') mapElement: any;
    map: google.maps.Map | undefined

    ngAfterViewInit(): void {

        let map: google.maps.Map, infoWindow: google.maps.InfoWindow, locationButton: HTMLElement | null;
        const loader = new Loader({
            apiKey: "AIzaSyDDkExs_4ZA-rnnX7Oj5KxnaNxUqePKdXE",
            version: "weekly"
        });

        loader.load().then(async () => {
            const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const infoWindow = new InfoWindow();
            async function initMap(): Promise<void> {

                map = new Map(document.getElementById("map") as HTMLElement, {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8,
                    mapId: '1000'
                });
                const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                const pin = new PinElement({
                    scale: 1.5,
                });

                CITIES.forEach((city, i) => {

                    const pin = new PinElement({
                        glyph: `${i + 1}`,
                    });
                    let marker = new AdvancedMarkerElement({
                        map,
                        position: { lat: city.lat, lng: city.lng },
                        title: city.name,
                        content: pin.element,
                    });
                    infoWindow.setContent(marker.title);
                    infoWindow.open(marker.map, marker);
                    const clickListener = marker.addListener('click', () => {
                        infoWindow.close();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(marker.map, marker);
                    });
                })
            }

            const locationButton = document.getElementById("locaBtn");

            locationButton!.textContent = "Pan to Current Location";
            locationButton!.classList.add("custom-map-control-button");

            // map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
            if (locationButton !== null) {
                locationButton.addEventListener("click", () => {
                    // Try HTML5 geolocation.
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position: GeolocationPosition) => {
                                const pos = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                };

                                infoWindow.setPosition(pos);
                                infoWindow.setContent("You are here");
                                infoWindow.open(map);
                                map.setCenter(pos);
                            },

                            () => {
                                handleLocationError(true, infoWindow, map.getCenter()!);
                            }
                        );
                    } else {
                        // Browser doesn't support Geolocation
                        handleLocationError(false, infoWindow, map.getCenter()!);
                    }
                })
            };

            function handleLocationError(
                browserHasGeolocation: boolean,
                infoWindow: google.maps.InfoWindow,
                pos: google.maps.LatLng
            ) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(
                    browserHasGeolocation
                        ? "Error: The Geolocation service failed."
                        : "Error: Your browser doesn't support geolocation."
                );
                infoWindow.open(map);
            }
            initMap();
        });
    }
}