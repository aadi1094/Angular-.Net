import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Property } from './property.service';

@Injectable({
  providedIn: 'root'
})
export class HouseApiService {
  constructor(private apiService: ApiService) { }

  // Get all houses
  getAllHouses(): Observable<Property[]> {
    return this.apiService.get<Property[]>('houses');
  }

  // Get houses by type (For Sale or For Rent)
  getHousesByType(type: string): Observable<Property[]> {
    return this.apiService.get<Property[]>(`houses/type/${type}`);
  }

  // Get house by ID
  getHouseById(id: number): Observable<Property> {
    return this.apiService.get<Property>(`houses/${id}`);
  }

  // Create new house listing
  createHouse(house: Partial<Property>): Observable<Property> {
    return this.apiService.post<Property>('houses', house);
  }

  // Update house listing
  updateHouse(id: number, house: Partial<Property>): Observable<any> {
    return this.apiService.put<any>(`houses/${id}`, house);
  }

  // Delete house listing
  deleteHouse(id: number): Observable<any> {
    return this.apiService.delete<any>(`houses/${id}`);
  }

  // Search houses with filters
  searchHouses(filters: any): Observable<Property[]> {
    return this.apiService.get<Property[]>('houses', filters);
  }
}
