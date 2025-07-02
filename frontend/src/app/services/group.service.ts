import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../types/group';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups`, group);
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups`);
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/groups/${id}`);
  }

  updateGroup(id: string, group: Partial<Group>): Observable<Group> {
    return this.http.patch<Group>(`${this.apiUrl}/groups/${id}`, group);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${id}`);
  }
}