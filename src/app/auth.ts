import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:5000/api/auth';
  token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  login(body:any) {
    return this.http.post<any>(`${this.url}/login`, body).pipe(
      tap(res => this.setSession(res.token))
    );
  }

  register(body:any) {
    return this.http.post<any>(`${this.url}/register`, body).pipe(
      tap(res => this.setSession(res.token))
    );
  }

  setSession(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }

  get isLoggedIn() {
    return !!this.token;
  }

  getCurrentUserProfile() {
    return this.http.get<any>(`${this.url}/profile`);
  }
}
