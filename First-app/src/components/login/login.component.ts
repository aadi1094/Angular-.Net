import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  standalone: true,
  styles: []
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login failed', error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
