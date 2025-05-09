import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NavBarComponent],
  template: `
    <app-nav-bar />
    <main
      class="h-screen flex flex-col justify-center items-center font-epilogue"
    >
      <h1 class="font-epilogue-extrabold text-4xl text-center mb-6">
        Create your account
      </h1>
      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md flex flex-col gap-4"
        autocomplete="off"
      >
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            required
          />
          @if(registerForm.get('name')?.touched) {
          @if(registerForm.get('name')?.errors?.['required']) {
          <div class="text-red-500 text-xs mt-1">Name is required.</div>
          } @if(registerForm.get('name')?.errors?.['minlength']) {
          <div class="text-red-500 text-xs mt-1">
            Name must be at least 3 characters.
          </div>
          } }
        </div>
        <div>
          <label class="block text-zinc-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            required
          />
          @if(registerForm.get('email')?.invalid &&
          registerForm.get('email')?.touched) {
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
          @if(registerForm.get('password')?.invalid &&
          registerForm.get('password')?.touched) {
          <div class="text-red-500 text-xs mt-1">
            Password is required (min 6 chars).
          </div>
          }
        </div>
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            required
          />
          @if(registerForm.get('confirmPassword')?.touched) {
          @if(registerForm.get('confirmPassword')?.errors?.['required']) {
          <div class="text-red-500 text-xs mt-1">
            Confirm password is required.
          </div>
          } @if(registerForm.get('confirmPassword')?.value !==
          registerForm.get('password')?.value &&
          registerForm.get('confirmPassword')?.touched &&
          registerForm.get('password')?.touched) {
          <div class="text-red-500 text-xs mt-1">Passwords do not match.</div>
          } }
        </div>
        <button
          type="submit"
          [disabled]="registerForm.invalid"
          [class.cursor-not-allowed]="registerForm.invalid"
          [class.cursor-pointer]="registerForm.valid"
          class="bg-black text-white font-semibold px-4 py-2 rounded-sm hover:bg-zinc-800 transition-colors mt-4 disabled:opacity-50"
        >
          Register
        </button>
      </form>
      <p class="text-neutral-500 text-sm mt-2">
        Already have an account?
        <a
          routerLink="/login"
          class="text-black underline hover:text-zinc-800 cursor-pointer"
          >Login</a
        >
      </p>
    </main>
  `,
  styles: ``,
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.controls['password']?.value ===
        this.registerForm.controls['confirmPassword']?.value
    ) {
      // Aquí va la lógica de registro
      console.log('Form submitted', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
