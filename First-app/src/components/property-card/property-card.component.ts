import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Property } from '../../services/property.service';
import { AuthService, User } from '../../services/auth.service';
import { HouseService } from '../../services/house.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent implements OnInit, OnDestroy {
  @Input() property!: Property;
  @Output() propertyDeleted = new EventEmitter<number>();
  
  isOwner = false;
  showDeleteConfirm = false;
  showMenu = false;
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private houseService: HouseService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe((user: User | null) => {
      if (user && this.property) {
        this.isOwner = user.id === this.property.ownerId;
      } else {
        this.isOwner = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation(); // Prevent event from bubbling up
    this.showMenu = !this.showMenu;
  }

  onEdit() {
    this.showMenu = false;
    this.router.navigate(['/edit-property', this.property.id]);
  }

  onDelete() {
    this.showMenu = false;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    this.houseService.deleteHouse(this.property.id).subscribe({
      next: () => {
        this.propertyDeleted.emit(this.property.id);
      },
      error: (error) => {
        console.error('Error deleting property:', error);
        // Implement proper error handling/notification
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  showPropertyDetails() {
    this.router.navigate(['/property', this.property.id]);
  }

  // Close modal on escape key
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.showDeleteConfirm = false;
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.showMenu = false;
    }
  }
}


