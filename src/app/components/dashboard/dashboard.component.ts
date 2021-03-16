import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GooglePlaceAutocomplete } from '../../models/google-place-autocomplete';
import { Loader } from "@googlemaps/js-api-loader";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  map;
  pickupFormControl = new FormControl();
  dropoffFormControl = new FormControl();
  private autocompleteService;
  addresses: Array<GooglePlaceAutocomplete> = [];
  selectedAddress: GooglePlaceAutocomplete;
  directionsService;
  directionsRenderer;
  selectedMode = "DRIVING";
  tasks = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(){

    const loader = new Loader({
      apiKey: "AIzaSyCqqZMYM-I8IKDKf8S7h7g0UyFpS71krkU",
      version: "weekly",
      libraries: ["places"]
    });
    
    loader.load().then(() => {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();

      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 39.953350, lng: -75.145610 },
        zoom: 12,
      });

      this.directionsRenderer.setMap(this.map);

      this.autocompleteService = new google.maps.places.AutocompleteService();

      this.pickupFormControl.valueChanges.subscribe(addr =>this.setAddresses(addr));
      this.dropoffFormControl.valueChanges.subscribe(addr =>this.setAddresses(addr));

    });

  }

  setAddresses(input) {
    this.selectedAddress = null;
    if (input === '') return this.addresses = [];

    this.autocompleteService.getPlacePredictions({input, types: ['address']}, (places, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) this.addresses = [];
      else this.addresses = places;

      this.cdr.detectChanges();
    });
  }

  autocompleteDisplayFn(address) {
    return address ? address.description : address;
  }

  createTask() {
    if (this.pickupFormControl.pristine || this.dropoffFormControl.pristine ) {
        window.alert("Please set both the pickup and dropoff addresses.");
    } else {
      this.tasks.push(
        {
          type: "Pickup",
          address: this.pickupFormControl.value.description
        },
        {
          type: "Dropoff",
          address: this.dropoffFormControl.value.description
        }
      );
      this.calculateAndDisplayRoute(
        this.directionsService,
        this.directionsRenderer
      );
      this.pickupFormControl.value.description = "";
      this.dropoffFormControl.value.description = "";
    }
  };

  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    const taskWaypoints = this.tasks.slice(1, -1);

  
    for (let i = 0; i < taskWaypoints.length; i++) {
      waypoints.push({
        location: taskWaypoints[i].address,
        stopover: true,
      });
    }

    directionsService.route(
      {
        origin: this.tasks[0].address,
        destination: this.tasks[(this.tasks.length - 1)].address,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[this.selectedMode]
      },
      (response, status) => {
        if (status === "OK" && response) {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.calculateAndDisplayRoute(
      this.directionsService,
      this.directionsRenderer
    );
  }

}
