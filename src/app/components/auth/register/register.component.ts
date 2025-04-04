import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Customer', Validators.required]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register({
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    }).subscribe({
      next: () => {
        this.success = 'Registration successful!';
        this.loading = false;

        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: error => {
        this.error = error.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
