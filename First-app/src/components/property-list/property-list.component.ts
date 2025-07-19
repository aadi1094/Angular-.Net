import { Component, OnInit, TrackByFunction } from '@angular/core';
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
  error: string = '';
  isLoading = true;
  trackByPropertyId: TrackByFunction<Property> = (index, property) => property.id;

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  private loadProperties(): void {
    this.isLoading = true;
    this.houseService.getAllHouses().subscribe({
      next: (houses: Property[]) => {
        this.properties = houses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = 'Failed to load properties. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
