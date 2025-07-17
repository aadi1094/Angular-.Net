import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  standalone: true
})
export class RegisterComponent {
  registerData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register(
      this.registerData.username,  // This will map to "name" in the backend
      this.registerData.email,
      this.registerData.password
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration failed', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
