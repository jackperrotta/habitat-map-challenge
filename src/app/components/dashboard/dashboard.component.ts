import { Component, OnInit, } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader"

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  map;
  constructor() { }

  ngOnInit(){

    const loader = new Loader({
      apiKey: "AIzaSyCqqZMYM-I8IKDKf8S7h7g0UyFpS71krkU",
      version: "weekly"
    });
    
    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
  }

}
