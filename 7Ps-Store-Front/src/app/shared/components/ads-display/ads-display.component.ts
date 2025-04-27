
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Ad } from '../../../models/ads.model';

@Component({
  selector: 'app-ads-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ads-display.component.html',
  styleUrls: ['./ads-display.component.css']
})
export class AdsDisplayComponent implements OnInit {
  ads: Ad[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAds();
  }

  loadAds() {
    this.isLoading = true;
    this.error = null;

    this.http.get<Ad[]>('http://localhost:4800/api/ads')
      .subscribe({
        next: (res) => {
          this.ads = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading ads:', err);
          this.error = 'Failed to load ads. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  trackByAdId(index: number, ad: Ad): string | undefined {
    return ad._id;
  }
}
