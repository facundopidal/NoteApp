import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../types/note';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/note`, note);
  }

  getNotesByGroup(groupId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/${groupId}`);
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/note/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/note/${id}`);
  }
}