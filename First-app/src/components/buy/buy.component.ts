import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService, Property } from '../../services/property.service';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { HouseService } from '../../services/house.service';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './buy.component.html',
  styleUrls: []
})
export class BuyComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  
  // Filter properties
  filters = {
    location: '',
    priceRange: '',
    propertyType: ''
  };

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.houseService.getAllHouses()
      .subscribe(houses => {
        this.allProperties = houses.filter(h => h.type === 'For Sale');
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
      if (this.filters.propertyType && !property.name.toLowerCase().includes(this.filters.propertyType.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}
