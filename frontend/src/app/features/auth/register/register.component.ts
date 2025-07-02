import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
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
        @if(errorMessage) {
          <div class="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded border border-red-200">
            {{ errorMessage }}
          </div>
        }
        <button
          type="submit"
          [disabled]="registerForm.invalid || isSubmitting"
          [class.cursor-not-allowed]="registerForm.invalid || isSubmitting"
          [class.cursor-pointer]="registerForm.valid && !isSubmitting"
          class="bg-black text-white font-semibold px-4 py-2 rounded-sm hover:bg-zinc-800 transition-colors mt-4 disabled:opacity-50 flex justify-center items-center"
        >
          @if(isSubmitting) {
            <span class="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          }
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
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
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
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const { email, password } = this.registerForm.value;
      
      this.authService.register(email, password).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Después del registro exitoso, hacer login automáticamente
          this.authService.login(email, password).subscribe({
            next: (loginResponse) => {
              console.log('Auto-login successful after registration', loginResponse);
              this.router.navigate(['/dashboard']);
            },
            error: (loginError) => {
              console.error('Auto-login failed after registration', loginError);
              // Aunque el registro fue exitoso, el login falló
              // Redirigir a la página de login para que el usuario intente manualmente
              this.isSubmitting = false;
              this.errorMessage = 'Registration successful but login failed. Please login manually.';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            }
          });
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
