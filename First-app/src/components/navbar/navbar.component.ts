import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showUserMenu = false;
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  ngOnDestroy(): void {
    // Clean up subscriptions or other resources here
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

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  navigateToProfile() {
    this.showUserMenu = false;
    // Implement profile navigation
  }

  navigateToMyProperties() {
    this.showUserMenu = false;
    // Implement my properties navigation
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-container') && !target.closest('[aria-haspopup="true"]')) {
      this.showUserMenu = false;
      this.showMobileMenu = false;
    }
  }
}
