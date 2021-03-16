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

  private map;

  private pickupFormControl = new FormControl();
  private dropoffFormControl = new FormControl();
  private autocompleteService;
  private addresses: Array<GooglePlaceAutocomplete> = [];
  private selectedAddress: GooglePlaceAutocomplete;

  private directionsService;
  private directionsRenderer;

  /* TODO: selectedMode sets the carriers route travel method and can be toggled between: DRIVING, BYCYCING, WALKING, TRANSITING */
  private selectedMode = "DRIVING";

  private tasks = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(){
    /* Load Google Map using API key after the app has initilized */
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
    });

    /* Handle input changes to the pickup and dropoff address fields */
    this.pickupFormControl.valueChanges.subscribe(addr => this.setAddresses(addr));
    this.dropoffFormControl.valueChanges.subscribe(addr => this.setAddresses(addr));
  }

  /*  Function called when user begins typing in the pickup or dropoff input and calls the autocomplete service to provide a list of address only predictions */
  setAddresses(input) {
    this.selectedAddress = null;
    if (input === '') return this.addresses = [];

    this.autocompleteService.getPlacePredictions({input, types: ['address']}, (places, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) this.addresses = [];
      else this.addresses = places;

      this.cdr.detectChanges();
    });
  }

  /* Function takes the address object from the input and returns the address description */
  autocompleteDisplayFn(address) {
    return address ? address.description : address;
  }

  /* Function called on "Create Task" submit that checks if the fields have been touched, then adds the pickup and dropoff values to the end of the tasks array with their corresponding types.
  TODO: Add validation with each address provided to verify it's an actual place via the Google Maps Places API before sending it through the route API to avoid errors. As an aside, Angular's form validation would do little more than checking for pristine in this case which is why it wasn't implemented. */
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
    }
  };

  /* Function inputs Google Maps API directions service and renderer, and uses the current tasks array of address to set points, then outputs route drawn on map if addresses provided are valid. 
  Modified from https://developers.google.com/maps/documentation/javascript/examples/directions-waypoints */
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

  /* Angular material cdk drag and drop function that moves items in the tasks array and displays the updated list. Then calls the function above to recalculate and draw the route on the map. 
  Source: https://material.angular.io/cdk/drag-drop/api */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.calculateAndDisplayRoute(
      this.directionsService,
      this.directionsRenderer
    );
  }

}
