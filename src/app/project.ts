import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private url = 'http://localhost:5000/api/projects';
  constructor(private http: HttpClient) { }

  getAll(search: string = '') {
    let params = search ? new HttpParams().set('q', search) : undefined;
    return this.http.get<any[]>(this.url, { params });
  }

  getMine() {
    return this.http.get<any[]>(`${this.url}/me`);
  }

  add(form: FormData) {
    return this.http.post<any>(this.url, form);
  }
  
  getById(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getByUserId(id: string) {
    return this.http.get<any[]>(`${this.url}/user/${id}`);
  }

}
