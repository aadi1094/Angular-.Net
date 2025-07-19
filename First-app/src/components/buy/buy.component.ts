import { Component, OnInit, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { PropertyService, Property } from '../../services/property.service';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { HouseService } from '../../services/house.service';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, FormsModule], // Add FormsModule here
  templateUrl: './buy.component.html',
  styleUrls: []
})
export class BuyComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  availableCities: string[] = [];
  
  // Filter properties
filters = {
  city: '',
  priceRange: '',
  propertyType: '',
  bedrooms: ''
};
trackByPropertyId: TrackByFunction<Property> = (index: number, property: Property) => property.id;

constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.houseService.getAllHouses().subscribe({
      next: (houses) => {
        this.allProperties = houses.filter(h => h.type === 'For Sale');
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

      // Price range filter
      if (this.filters.priceRange) {
        const price = property.price;
        switch (this.filters.priceRange) {
          case '0-500000':
            if (price >= 500000) return false;
            break;
          case '500000-1000000':
            if (price < 500000 || price >= 1000000) return false;
            break;
          case '1000000+':
            if (price < 1000000) return false;
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
