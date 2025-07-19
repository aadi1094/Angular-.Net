import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PropertyService, Property } from '../../services/property.service';
import { HouseService } from '../../services/house.service';
import { AuthService } from '../../services/auth.service';
import { FileUploadService } from '../../services/file-upload.service';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-property',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.css']
})
export class ListPropertyComponent implements OnInit, OnDestroy {
  propertyData = {
    name: '',
    propertyType: '',
    city: '',
    area: '',
    areaSize: 0,
    bedrooms: '',
    bathrooms: '',
    type: '',
    price: 0,
    description: '',
    amenities: [] as string[],
    contactNumber: ''
  };

  uploadedImages: string[] = [];
  isLoggedIn = false;
  errorMessage = '';
  isSubmitting = false;
  isEditing = false;
  propertyId?: number;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private houseService: HouseService,
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {
    this.subscription = this.authService.isLoggedIn$.subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );
  }

  ngOnInit() {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.propertyId = +id;
      this.loadProperty(this.propertyId);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProperty(id: number) {
    this.houseService.getHouseById(id).subscribe({
      next: (property) => {
        if (property) {
          // Map all property fields
          this.propertyData = {
            name: property.name || '',
            propertyType: property.propertyType || '',
            city: property.city || '',
            area: property.area || '',
            areaSize: property.areaSize || 0,
            bedrooms: property.bedrooms?.toString() || '',
            bathrooms: property.bathrooms?.toString() || '',
            type: property.type || '',
            price: property.price || 0,
            description: property.description || '',
            amenities: property.amenities || [],
            contactNumber: property.contactNumber || ''
          };

          // Handle images
          this.uploadedImages = [];
          if (property.imageUrl) {
            this.uploadedImages.push(property.imageUrl);
          }
          if (property.additionalImages && property.additionalImages.length > 0) {
            this.uploadedImages.push(...property.additionalImages);
          }

          // Set checkbox states for amenities
          setTimeout(() => {
            this.setAmenityCheckboxes();
          });
        }
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.errorMessage = 'Failed to load property details';
      }
    });
  }

  private setAmenityCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="amenities"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      if (this.propertyData.amenities.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  onImageUpload(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size should not exceed 5MB');
          continue;
        }
        
        this.fileUploadService.convertToBase64(file).then((base64: string) => {
          this.uploadedImages.push(base64);
        });
      }
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  onAmenityChange(event: any) {
    const amenity = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      this.propertyData.amenities.push(amenity);
    } else {
      const index = this.propertyData.amenities.indexOf(amenity);
      if (index !== -1) {
        this.propertyData.amenities.splice(index, 1);
      }
    }
  }

  calculateFormProgress(): number {
    let filledFields = 0;
    const totalFields = 8; // Count of required fields
    
    if (this.propertyData.name) filledFields++;
    if (this.propertyData.propertyType) filledFields++;
    if (this.propertyData.city) filledFields++;
    if (this.propertyData.area) filledFields++;
    if (this.propertyData.areaSize > 0) filledFields++;
    if (this.propertyData.type) filledFields++;
    if (this.propertyData.price > 0) filledFields++;
    if (this.propertyData.contactNumber) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  }

  onSubmit() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/list-property' } 
      });
      return;
    }
    
    if (this.uploadedImages.length === 0) {
      this.errorMessage = "Please upload at least one image";
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const propertyData = {
      id: this.isEditing && this.propertyId ? this.propertyId : 0, // Use existing ID for editing
      name: this.propertyData.name,
      price: this.propertyData.price,
      area: this.propertyData.area,
      city: this.propertyData.city,
      areaSize: this.propertyData.areaSize,
      imageUrl: this.uploadedImages[0], // Main image
      type: this.propertyData.type,
      bedrooms: parseInt(this.propertyData.bedrooms),
      bathrooms: parseInt(this.propertyData.bathrooms),
      propertyType: this.propertyData.propertyType,
      description: this.propertyData.description,
      amenities: this.propertyData.amenities,
      additionalImages: this.uploadedImages.slice(1), // Store additional images array
      contactNumber: this.propertyData.contactNumber
    };

    const request = this.isEditing 
      ? this.houseService.updateHouse(this.propertyId!, propertyData)
      : this.houseService.addHouse(propertyData);

    request.subscribe({
      next: (response) => {
        const message = this.isEditing ? 'Property updated successfully!' : 'Property listed successfully!';
        this.showSuccessToast(message);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to save property';
        this.isSubmitting = false;
      }
    });
  }

  private showSuccessToast(message: string) {
    // Implement toast notification here
    alert(message); // Temporary solution, replace with proper toast
  }

  onSaveAsDraft() {
    console.log('Property saved as draft:', this.propertyData);
    localStorage.setItem('property_draft', JSON.stringify({
      ...this.propertyData,
      images: this.uploadedImages
    }));
    alert('Property saved as draft!');
  }

  resetForm() {
    this.propertyData = {
      name: '',
      propertyType: '',
      city: '',
      area: '',
      areaSize: 0,
      bedrooms: '',
      bathrooms: '',
      type: '',
      price: 0,
      description: '',
      amenities: [],
      contactNumber: ''
    };
    this.uploadedImages = [];
    this.errorMessage = '';
  }
}

