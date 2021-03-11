import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

// Componenets
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskEnterComponent } from './components/task-enter/task-enter.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskMapComponent } from './components/task-map/task-map.component';

// Third Party
// import { Loader } from "@googlemaps/js-api-loader"


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TaskEnterComponent,
    TaskListComponent,
    TaskMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
