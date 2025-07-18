import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Property } from './property.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private apiUrl = `${environment.apiUrl}/api/house`;

  constructor(private http: HttpClient) { }

  getAllHouses(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl)
      .pipe(
        tap(houses => console.log('Fetched houses:', houses)),
        retry(1),
        catchError(this.handleError)
      );
  }

  getHouseById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getHousesByType(type: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${environment.apiUrl}/houses/type/${type}`)
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
    
    return this.http.get<Property[]>(`${environment.apiUrl}/houses/search`, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addHouse(property: Property): Observable<Property> {
    if (!localStorage.getItem('auth_token')) {
      return throwError(() => new Error('User not authenticated'));
    }

    const createHouseDto = {
      ...property,
      amenities: property.amenities || [],
      additionalImages: property.additionalImages || []
    };

    return this.http.post<Property>(
      this.apiUrl,
      createHouseDto,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error details:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Please login to list a property'));
        }
        return throwError(() => new Error(error.error?.message || 'Failed to create house'));
      })
    );
  }

  updateHouse(id: number, property: Property): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, property, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteHouse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

