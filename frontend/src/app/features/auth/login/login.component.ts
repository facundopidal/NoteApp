import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NavBarComponent],
  template: `
    <app-nav-bar />
    <main
      class="h-screen flex flex-col justify-center items-center font-epilogue"
    >
      <h1 class="font-epilogue-extrabold text-4xl text-center mb-6">
        Login to your account
      </h1>
      <form
        [formGroup]="loginForm"
        (ngSubmit)="onSubmit()"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md flex flex-col gap-4"
        autocomplete="off"
      >
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            required
          />
          @if(loginForm.get('email')?.invalid &&
          loginForm.get('email')?.touched) {
          <div class="text-red-500 text-xs mt-1">Valid email is required.</div>
          }
        </div>
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            required
          />
          @if(loginForm.get('password')?.invalid &&
          loginForm.get('password')?.touched) {
          <div class="text-red-500 text-xs mt-1">
            Password is required (min 6 chars).
          </div>
          }
        </div>
        <button
          type="submit"
          [disabled]="loginForm.invalid"
          [class.cursor-not-allowed]="loginForm.invalid"
          [class.cursor-pointer]="loginForm.valid"
          class="bg-black text-white font-semibold px-4 py-2 rounded-sm hover:bg-zinc-800 transition-colors mt-4 disabled:opacity-50"
        >
          Login
        </button>
      </form>
      <p class="text-neutral-500 text-sm mt-2">
        Don't have an account?
        <a
          routerLink="/register"
          class="text-black underline hover:text-zinc-800 cursor-pointer"
          >Register</a
        >
      </p>
    </main>
  `,
  styles: ``,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Aquí va la lógica de login
      // console.log('Login', this.loginForm.value);
      alert('Login successful!');

      this.router.navigate(['/dashboard']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
