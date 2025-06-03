import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, ButtonComponent],
  template: `
    <nav
      class="font-epilogue font-bold flex justify-between items-center py-4 px-6"
    >
      <a routerLink="" class="text-lg">NoteApp</a>
      <div class="flex items-center space-x-4">
        <app-button routerLink="/register"> Registrarse </app-button>
        <app-button routerLink="/login"> Iniciar Sesión </app-button>
      </div>
    </nav>
  `,
  styles: ``,
})
export class NavBarComponent {}
