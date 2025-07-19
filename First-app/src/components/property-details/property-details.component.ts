import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../../services/property.service';
import { HouseService } from '../../services/house.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrls: []
})
export class PropertyDetailsComponent implements OnInit {
  property?: Property;
  currentImage: string | null = null;
  isLoading = true;
  error: string | null = null;

  propertyDetails: { label: string; value: string | number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseService: HouseService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProperty(id);
  }

  private loadProperty(id: number) {
    this.houseService.getHouseById(id).subscribe({
      next: (property) => {
        this.property = property;
        this.currentImage = property.imageUrl;
        this.setupPropertyDetails();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load property details';
        this.isLoading = false;
      }
    });
  }

  private setupPropertyDetails() {
    if (!this.property) return;

    this.propertyDetails = [
      { label: 'Property Type', value: this.property.propertyType },
      { label: 'Area Size', value: `${this.property.areaSize} sq ft` },
      { label: 'Bedrooms', value: this.property.bedrooms },
      { label: 'Bathrooms', value: this.property.bathrooms },
      { label: 'Listing Type', value: this.property.type },
      { label: 'Amenities', value: this.property.amenities?.join(', ') || 'None' },
      { label: 'Contact Number', value: this.property.contactNumber || 'Not provided' }
    ];
  }

  getTimeAgo(): string {
    // Implement proper time ago logic
    return '2 days ago';
  }

  getMemberSince(): string {
    // Implement proper date formatting
    return 'Nov 2023';
  }

  getAllImages(): string[] {
    if (!this.property) return [];
    const images = [this.property.imageUrl];
    if (this.property.additionalImages) {
      images.push(...this.property.additionalImages);
    }
    return images.filter(img => img);
  }

  setCurrentImage(image: string) {
    this.currentImage = image;
  }

  closeDetails() {
    this.router.navigate(['/properties']);
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

  chatWithSeller() {
    if (!this.property?.contactNumber) {
      alert('Contact number not available for this property');
      return;
    }

    // Clean the phone number (remove spaces, dashes, parentheses)
    const cleanedNumber = this.property.contactNumber
      .replace(/[\s\-\(\)\+]/g, '')
      .replace(/^0/, ''); // Remove leading zero if present

    // Format the default message
    const propertyName = this.property.name || 'your property';
    const defaultMessage = `Hi, I'm interested in ${propertyName} listed on Housing Platform. Could you please provide more details?`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab/window
    window.open(whatsappUrl, '_blank');
  }

  // Helper method to format phone number for display
  getFormattedPhoneNumber(): string {
    if (!this.property?.contactNumber) return '';
    
    const number = this.property.contactNumber;
    // Add basic formatting for display (you can customize this based on your needs)
    if (number.length === 10) {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return number;
  }

  // Check if contact number is available
  hasContactNumber(): boolean {
    return !!(this.property?.contactNumber && this.property.contactNumber.trim());
  }

  getRandomViews(): number {
    // Generate a random view count for demo purposes
    return Math.floor(Math.random() * 500) + 50;
  }
}
