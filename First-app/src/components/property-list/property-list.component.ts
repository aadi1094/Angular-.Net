import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { Property } from '../../services/property.service';
import { HouseService } from '../../services/house.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  private loadProperties(): void {
    this.houseService.getAllHouses().subscribe({
      next: (houses: Property[]) => {
        this.properties = houses;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }
}
