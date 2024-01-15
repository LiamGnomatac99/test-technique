import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { Loader } from "@googlemaps/js-api-loader";
import { } from 'googlemaps';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {


  @ViewChild('map') mapElement: any;
  map: google.maps.Map | undefined

  ngAfterViewInit(): void {

    let map: google.maps.Map, infoWindow: google.maps.InfoWindow, locationButton: HTMLElement | null;
    const loader = new Loader({
      apiKey: "AIzaSyDDkExs_4ZA-rnnX7Oj5KxnaNxUqePKdXE",
      version: "weekly"
    });

    loader.load().then(async () => {
      async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        map = new Map(document.getElementById("map") as HTMLElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }
      infoWindow = new google.maps.InfoWindow();
      const locationButton = document.getElementById("locaBtn");

      locationButton!.textContent = "Pan to Current Location";
      // locationButton.classList.add("custom-map-control-button");

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
                infoWindow.setContent("Location found.");
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
