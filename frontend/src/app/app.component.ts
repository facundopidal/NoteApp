import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.checkAuthStatus().subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
