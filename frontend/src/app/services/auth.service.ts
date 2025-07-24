import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  private tokenRefreshed$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        })
      );
  }

  register(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/register`, {
        email,
        password,
      })
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.currentUserSignal.set(null);
      this.router.navigate(['/login']);
    });
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/refresh`, {});
  }

  waitForTokenRefresh(): Observable<void> {
    return this.tokenRefreshed$.asObservable();
  }

  notifyTokenRefreshed(): void {
    this.tokenRefreshed$.next();
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
  }

  checkAuthStatus(): Observable<User | null> {
    return this.http.get<User | null>(`${this.apiUrl}/profile`).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
      catchError((error) => {
        this.setCurrentUser(null);
        return [null];
      })
    );
  }
}
