# habitat-map-challenge

### Summary
A core part of our business is the ability to efficiently route our runners between restaurant pickups and customer deliveries, including 'batched' orders (runner has 2+ orders in their queue simultaneously). Dispatchers being able to visualize a runner's route is crucial to a smooth operation.

The goal of this challenge is to build a small app to enter and visualize a route.

The app will have three different components:

TaskEnter - Address input using Google's Places Autocomplete widget. Task should be able to be marked as a pickup or dropoff, and submitted to TaskList
TaskList - Ordered set of tasks that can be resorted (Pickup=>Dropoff=>Pickup=>Dropoff to Pickup=>Pickup=>Dropoff=>Dropoff)
TaskMap - Display Pickup and Dropoff markers in order, with route in between, using this example + the additional parameters of Google's DirectionService API for waypoints.
You can use the React/Typescript/Node.js boilerplate at the root of this repo OR with the frameworks/tools of your choice, no penalty either way!

## Notes:

If you do choose to use the boilerplate, keep in mind that the project shouldn't require any of the backend code or a database
Tests, extensive documentation, and actual deployment are nice-to-haves for the scope of this project. We're looking mostly for clean, readable code that elegantly handles user input, API requests/responses on the UI.
If you're not able to get to feature-complete in the rough timeframe, no problem! We'd rather hear what challenges that blocked you from getting there, and the approaches you took to overcome them.
