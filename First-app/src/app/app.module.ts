import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { PropertyCardComponent } from '../components/property-card/property-card.component';
import { BuyComponent } from '../components/buy/buy.component';
import { RentComponent } from '../components/rent/rent.component';
import { ListPropertyComponent } from '../components/list-property/list-property.component';
import { PropertyService } from '../services/property.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PropertyCardComponent,
    BuyComponent,
    RentComponent,
    ListPropertyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    PropertyService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
