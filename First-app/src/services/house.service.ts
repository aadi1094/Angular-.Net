import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Property } from './property.service';
import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllHouses(): Observable<Property[]> {
    return this.http.get<Property[]>(`${API_URL}/api/house`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getHouseById(id: number): Observable<Property> {
    return this.http.get<Property>(`${API_URL}/api/house/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getHousesByType(type: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${API_URL}/houses/type/${type}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  searchHouses(filters: any): Observable<Property[]> {
    let params = new HttpParams();
    
    // Add all filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.append(key, filters[key]);
      }
    });
    
    return this.http.get<Property[]>(`${API_URL}/houses/search`, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addHouse(property: Property): Observable<Property> {
    const createHouseDto = {
      ...property,
      amenities: property.amenities || [],
      additionalImages: property.additionalImages || []
    };

    return this.http.post<Property>(
      `${API_URL}/api/house`,
      createHouseDto,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error details:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create house'));
      })
    );
  }

  updateHouse(id: number, property: Property): Observable<any> {
    return this.http.put(`${API_URL}/api/house/${id}`, property, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteHouse(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/api/house/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling method
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
