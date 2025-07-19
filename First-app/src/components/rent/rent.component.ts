import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseService } from '../../services/house.service';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { Property } from '../../services/property.service';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, FormsModule],
  templateUrl: './rent.component.html',
  styles: []
})
export class RentComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  availableCities: string[] = [];
  
  // Filter properties
  filters = {
    city: '',
    monthlyRent: '',
    bedrooms: '',
    propertyType: ''
  };

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.houseService.getAllHouses().subscribe({
      next: (houses) => {
        this.allProperties = houses.filter(h => h.type === 'For Rent');
        this.filteredProperties = [...this.allProperties];
        this.extractAvailableCities();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  extractAvailableCities(): void {
    const cities = this.allProperties.map(property => property.city);
    this.availableCities = [...new Set(cities)].sort();
  }

  onFilterChange(filterType: string, value: string) {
    this.filters[filterType as keyof typeof this.filters] = value;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProperties = this.allProperties.filter(property => {
      // City filter
      if (this.filters.city && property.city !== this.filters.city) {
        return false;
      }

      // Monthly rent filter
      if (this.filters.monthlyRent) {
        const price = property.price;
        switch (this.filters.monthlyRent) {
          case '0-2000':
            if (price >= 2000) return false;
            break;
          case '2000-4000':
            if (price < 2000 || price >= 4000) return false;
            break;
          case '4000+':
            if (price < 4000) return false;
            break;
        }
      }

      // Property type filter
      if (this.filters.propertyType && property.propertyType !== this.filters.propertyType) {
        return false;
      }

      // Bedrooms filter
      if (this.filters.bedrooms) {
        const bedrooms = parseInt(this.filters.bedrooms);
        if (property.bedrooms !== bedrooms) {
          return false;
        }
      }

      return true;
    });
  }
}
