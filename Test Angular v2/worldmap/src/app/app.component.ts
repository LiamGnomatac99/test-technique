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
    const loader = new Loader({
      apiKey: "AIzaSyDDkExs_4ZA-rnnX7Oj5KxnaNxUqePKdXE",
      version: "weekly"
    });

    loader.load().then(async () => {
      let map: google.maps.Map;
      async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        map = new Map(document.getElementById("map") as HTMLElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }
      initMap();
    });
  }


  

}
