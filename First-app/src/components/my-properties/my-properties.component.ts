import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { Router } from '@angular/router';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { Property } from '../../services/property.service';
import { HouseService } from '../../services/house.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, FormsModule], // Add FormsModule here
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  currentUser: User | null = null;
  isLoading = true;
  error: string = '';
  
  // Filter options
  filters = {
    type: '',
    status: '',
    sortBy: 'newest'
  };

  constructor(
    private houseService: HouseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserProperties();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private loadUserProperties(): void {
    this.isLoading = true;
    this.houseService.getAllHouses().subscribe({
      next: (houses: Property[]) => {
        // Filter properties owned by current user
        this.properties = houses.filter(house => 
          house.ownerId === this.currentUser?.id
        );
        this.filteredProperties = [...this.properties];
        this.applySorting();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = 'Failed to load your properties. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(filterType: string, value: string) {
    this.filters[filterType as keyof typeof this.filters] = value;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProperties = this.properties.filter(property => {
      // Type filter
      if (this.filters.type && property.type !== this.filters.type) {
        return false;
      }
      return true;
    });
    this.applySorting();
  }

  private applySorting(): void {
    this.filteredProperties.sort((a, b) => {
      switch (this.filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  onPropertyDeleted(propertyId: number): void {
    this.properties = this.properties.filter(p => p.id !== propertyId);
    this.filteredProperties = this.filteredProperties.filter(p => p.id !== propertyId);
  }

  navigateToAddProperty(): void {
    this.router.navigate(['/list-property']);
  }

  getPropertyStats() {
    const totalProperties = this.properties.length;
    const forSale = this.properties.filter(p => p.type === 'For Sale').length;
    const forRent = this.properties.filter(p => p.type === 'For Rent').length;
    
    return { totalProperties, forSale, forRent };
  }
}
