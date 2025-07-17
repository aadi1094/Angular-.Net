import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToBuy(): void {
    this.router.navigate(['/buy']);
  }

  navigateToRent(): void {
    this.router.navigate(['/rent']);
  }

  navigateToListProperty(): void {
    this.router.navigate(['/list-property']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
