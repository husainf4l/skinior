import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  login1(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => this.setToken(response.access_token))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password }; 
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(response => this.setToken(response.access_token))  // Store token on successful response
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  
}
