// src/app/shared/components/search-bar/search-bar.component.ts
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChannelService } from '../../../core/services/channel.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface ChannelLogo {
  url: string;
}

interface SatelliteInfo {
  position: string;
  position_value: number;
  position_direction: string;
  satellite_name: string;
}

interface FrequencyInfo {
  text: string;
  value: number;
}

interface EirpInfo {
  text: string;
  value: number;
}

interface TechnicalInfo {
  beam: string;
  eirp: EirpInfo;
  frequency: FrequencyInfo;
}

interface Metadata {
  source: string;
  scraped_at: string;
  country: string;
}

interface Channel {
  channel_name: string;
  logo?: ChannelLogo;
  satellite_info?: SatelliteInfo;
  technical_info?: TechnicalInfo;
  metadata?: Metadata;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  searchResults: Channel[] = [];
  isLoading = false;

  constructor(private channelService: ChannelService) {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.handleSearch(query);
      });
  }

  private handleSearch(query: string | null): void {
    if (query && query.trim().length > 0) {
      this.isLoading = true;
      this.channelService.searchChannels(query).subscribe({
        next: (results: Channel[]) => {
          this.searchResults = results;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search failed:', err);
          this.searchResults = [];
          this.isLoading = false;
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  selectChannel(channel: Channel): void {
    // Handle channel selection
    console.log('Selected channel:', channel);
    // You can emit an event or use a service to communicate with other components

    // Example: Emit an event (you would need to add an EventEmitter to the class)
    // this.channelSelected.emit(channel);

    // Example: Navigate to a channel detail page
    // this.router.navigate(['/channel', channelId]);

    // Clear search after selection
    this.searchControl.setValue('');
    this.searchResults = [];
  }
}
