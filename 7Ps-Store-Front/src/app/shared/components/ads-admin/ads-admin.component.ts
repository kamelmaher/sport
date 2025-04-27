
// ads-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdsService } from '../../../core/services/ads.service';
import { Ad } from '../../../models/ads.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ads-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ads-admin.component.html',
  styleUrls: ['./ads-admin.component.css']
})
export class AdsAdminComponent implements OnInit {
  ads: Ad[] = [];
  adForm: FormGroup;
  selectedFile: File | null = null;
  isEditing = false;
  currentAdId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private adsService: AdsService,
    private fb: FormBuilder
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      link: ['', [Validators.required, Validators.pattern('https?://.*')]]
    });
  }

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds(): void {
    this.isLoading = true;
    this.adsService.getAds().subscribe({
      next: (data) => {
        this.ads = data;
        // console.log('Ads:', this.ads);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'فشل تحميل الإعلانات';
        this.isLoading = false;
        console.error('Error loading ads:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submitForm(): void {
    if (this.adForm.invalid) {
      this.adForm.markAllAsTouched();
      return;
    }

    if (this.isEditing && this.currentAdId) {
      this.updateAd();
    } else {
      this.createAd();
    }
  }

  createAd(): void {
    if (!this.selectedFile && !this.isEditing) {
      this.errorMessage = 'Image is required';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.adForm.get('title')?.value);
    formData.append('link', this.adForm.get('link')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isLoading = true;
    this.adsService.createAd(formData).subscribe({

      next: (newAd) => {
        this.ads.push(newAd);
        this.resetForm();
        this.successMessage = 'تم انشاء الإعلان بنجاح';
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'فشل انشاء الإعلان';
        this.isLoading = false;
        console.error('Error creating ad:', error);

        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  updateAd(): void {
    if (!this.currentAdId) return;

    const adData: Partial<Ad> = {
      title: this.adForm.get('title')?.value,
      link: this.adForm.get('link')?.value
    };

    this.isLoading = true;
    this.adsService.updateAd(this.currentAdId, adData).subscribe({
      next: (updatedAd) => {
        const index = this.ads.findIndex(ad => ad._id === this.currentAdId);
        if (index !== -1) {
          this.ads[index] = updatedAd;
        }
        this.resetForm();
        this.successMessage = 'تم تحديث الإعلان بنجاح';
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'فشل تحديث الإعلان';
        this.isLoading = false;
        console.error('Error updating ad:', error);

        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  editAd(ad: Ad): void {
    this.isEditing = true;
    this.currentAdId = ad._id || null;
    this.adForm.patchValue({
      title: ad.title,
      link: ad.link
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAd(ad: Ad): void {
    if (!ad._id) return;

    if (confirm('هل انت متاكد من حذف هذا الإعلان؟')) {
      this.isLoading = true;
      this.adsService.deleteAd(ad._id).subscribe({
        next: () => {
          this.ads = this.ads.filter(a => a._id !== ad._id);
          this.successMessage = 'تم حذف الإعلان بنجاح';
          this.isLoading = false;

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'فشل حذف الإعلان';
          this.isLoading = false;
          console.error('Error deleting ad:', error);

          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      });
    }
  }

  resetForm(): void {
    this.adForm.reset();
    this.selectedFile = null;
    this.isEditing = false;
    this.currentAdId = null;

    // Reset file input
    const fileInput = document.getElementById('adImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  get titleControl() { return this.adForm.get('title'); }
  get linkControl() { return this.adForm.get('link'); }
}
