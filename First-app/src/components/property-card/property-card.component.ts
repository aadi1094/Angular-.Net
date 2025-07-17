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
  showDetails = false;
  private subscription!: Subscription;
  currentImage: string | null = null;

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

  getAllImages(): string[] {
    const images: string[] = [];
    if (this.property.imageUrl) {
      images.push(this.property.imageUrl);
    }
    if (this.property.additionalImages && this.property.additionalImages.length > 0) {
      images.push(...this.property.additionalImages);
    }
    return images.filter(img => img); // Filter out any null/undefined values
  }

  setCurrentImage(image: string) {
    this.currentImage = image;
  }

  showPropertyDetails() {
    this.showDetails = true;
    const images = this.getAllImages();
    this.currentImage = images.length > 0 ? images[0] : null;
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeDetails() {
    this.showDetails = false;
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  // Close modal on escape key
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closeDetails();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.showMenu = false;
    }
  }

  navigateNext() {
    const images = this.getAllImages();
    const currentIndex = images.indexOf(this.currentImage || '');
    const nextIndex = (currentIndex + 1) % images.length;
    this.currentImage = images[nextIndex];
  }

  navigatePrevious() {
    const images = this.getAllImages();
    const currentIndex = images.indexOf(this.currentImage || '');
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    this.currentImage = images[previousIndex];
  }
}

