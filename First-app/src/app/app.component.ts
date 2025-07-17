import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { PropertyCardComponent } from '../components/property-card/property-card.component';
import { PropertyService, Property } from '../services/property.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, PropertyCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Housing Platform';
}
    
 