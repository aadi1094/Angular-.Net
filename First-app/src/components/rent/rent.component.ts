import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HouseService } from '../../services/house.service';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { Property } from '../../services/property.service';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './rent.component.html',
  styles: []
})
export class RentComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  
  // Filter properties
  filters = {
    location: '',
    monthlyRent: '',
    bedrooms: ''
  };

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.houseService.getAllHouses()
      .subscribe(houses => {
        this.allProperties = houses.filter(h => h.type === 'For Rent');
        this.filteredProperties = [...this.allProperties];
      });
  }

  onFilterChange(filterType: string, value: string) {
    this.filters[filterType as keyof typeof this.filters] = value;
  }

  onSearch() {
    this.filteredProperties = this.allProperties.filter(property => {
      // Location filter
      if (this.filters.location && !property.area.toLowerCase().includes(this.filters.location.toLowerCase())) {
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

      // Bedrooms filter (simplified - checking if property name contains bedroom info)
      if (this.filters.bedrooms) {
        const bedrooms = this.filters.bedrooms;
        if (bedrooms === '1' && !property.name.toLowerCase().includes('studio') && !property.name.toLowerCase().includes('1')) {
          return false;
        }
        // Add more bedroom logic as needed
      }

      return true;
    });
  }
}
