import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavBarComponent, RouterLink],
  template: `
    <app-nav-bar />
    <main
      class="h-screen flex flex-col justify-center items-center font-epilogue"
    >
      <h1 class="font-epilogue-extrabold text-5xl text-center -mt-20">
        Welcome to NoteApp
      </h1>
      <p
        class="text-neutral-500 text-xl mt-4 font-semibold text-center max-w-2xl mx-auto"
      >
        A simple note-taking app that allows you to create, edit, and delete
        notes.
      </p>
      <div class="flex justify-center items-center mt-8 gap-4">
        <button>
          <a
            routerLink="/register"
            class="bg-black text-white font-semibold px-4 py-2 rounded-sm cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            Get Started
          </a>
        </button>
        <button>
          <a
            routerLink="/login"
            class="text-black font-semibold px-4 py-2 rounded-sm cursor-pointer border border-neutral-300 hover:bg-neutral-100 transition-colors "
          >
            Login
          </a>
        </button>
      </div>
    </main>
  `,
  styles: ``,
})
export class HomeComponent {}
