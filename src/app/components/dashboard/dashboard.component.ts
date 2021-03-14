import { Component, OnInit, } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Loader } from "@googlemaps/js-api-loader";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  map;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];

  constructor() { }

  ngOnInit(){

    const loader = new Loader({
      apiKey: "AIzaSyCqqZMYM-I8IKDKf8S7h7g0UyFpS71krkU",
      version: "weekly"
    });
    
    loader.load().then(() => {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 39.953350, lng: -75.145610 },
        zoom: 12,
      });

      directionsRenderer.setMap(this.map);

      calculateAndDisplayRoute(
        directionsService,
        directionsRenderer
      );

      // const onChangeHandler = function () {
      //   calculateAndDisplayRoute(directionsService, directionsRenderer);
      // };
      // (document.getElementById("start") as HTMLElement).addEventListener(
      //   "change",
      //   onChangeHandler
      // );
      // (document.getElementById("end") as HTMLElement).addEventListener(
      //   "change",
      //   onChangeHandler
      // );
    });

    function calculateAndDisplayRoute(
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
    ) {
      directionsService.route(
        {
          origin: {
            // query: (document.getElementById("start") as HTMLInputElement).value,
            query: "philadelphia, pa"
          },
          destination: {
            // query: (document.getElementById("end") as HTMLInputElement).value,
            query: "los angeles, ca"
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

}
