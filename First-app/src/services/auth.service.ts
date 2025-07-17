import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    this.restoreUserSession();
  }

  private getUserFromStorage(): User | null {
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }

  private restoreUserSession() {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
            const user = {
              id: response.userId,
              email: response.email,
              name: response.name,
              role: response.role
            };
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/register`, {
      name,
      email,
      password
    }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          const user = {
            id: response.userId,
            email: response.email,
            name: response.name,
            role: response.role
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      })
    );
  }
}
