import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ButtonComponent],
  template: `
    <nav
      class="font-epilogue font-bold flex flex-col items-center gap-4 py-4 px-6 md:flex-row md:justify-between"
    >
      <a routerLink="" class="text-lg">NoteApp</a>
      <div
        class="flex flex-wrap justify-center items-center space-x-4 gap-y-2"
        [class.invisible]="!showButtons"
      >
        <app-button routerLink="/register"> Registrarse </app-button>
        <app-button routerLink="/login"> Iniciar Sesión </app-button>
      </div>
    </nav>
  `,
  styles: ``,
})
export class NavBarComponent implements OnInit {
  showButtons = true;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.showButtons =
      !this.router.url.includes('/register') &&
      !this.router.url.includes('/login');
  }
}
