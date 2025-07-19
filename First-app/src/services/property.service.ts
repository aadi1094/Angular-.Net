import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Property {
  id: number;
  name: string;
  price: number;
  area: string;
  city: string;
  areaSize: number;
  imageUrl: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  description: string;
  ownerId?: number;
  amenities?: string[];
  additionalImages?: string[];
  listedDate?: Date;
  contactNumber?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties: Property[] = [];

  constructor(private http: HttpClient) {}

  getAllProperties(): Property[] {
    return this.properties;
  }

  getPropertiesForRent(): Property[] {
    return this.properties.filter(property => property.type === 'For Rent');
  }

  getPropertiesForSale(): Property[] {
    return this.properties.filter(property => property.type === 'For Sale');
  }

  getPropertyById(id: number): Property | undefined {
    return this.properties.find(property => property.id === id);
  }

  addProperty(property: Property): void {
    this.properties.push(property);
  }

  updateProperty(id: number, updatedProperty: Partial<Property>): boolean {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties[index] = { ...this.properties[index], ...updatedProperty };
      return true;
    }
    return false;
  }

  deleteProperty(id: number): boolean {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    return false;
  }

  getFilteredProperties(filters: any): Property[] {
    let filteredProperties = [...this.properties];
    
    // Apply filters
    if (filters.type) {
      filteredProperties = filteredProperties.filter(p => p.type === filters.type);
    }
    
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms !== undefined && p.bedrooms >= filters.bedrooms);
    }
    
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms !== undefined && p.bathrooms >= filters.bathrooms);
    }
    
    if (filters.city) {
      filteredProperties = filteredProperties.filter(p => 
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(p => {
        // If property has no amenities or amenities is undefined, return false
        if (!p.amenities) return false;
        
        // Check if property has all the required amenities
        return filters.amenities.every((amenity: string) => 
          p.amenities!.includes(amenity)
        );
      });
    }
    
    return filteredProperties;
  }
}
