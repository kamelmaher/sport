import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../core/services/channel.service';
import { Channel, ChannelResponse } from '../../../models/channel.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  channels: Channel[] = [];
  isLoading = true;
  selectedCountry: string | null = null;
  searchTerm: string | null = null;
  arabCountries: string[] = [];

  constructor(private channelService: ChannelService) { }

  ngOnInit(): void {
    this.loadArabCountries();
    this.loadChannels();
  }

  loadArabCountries(): void {
    this.channelService.getArabCountries().subscribe({
      next: (countries) => {
        this.arabCountries = countries;
        console.log('Arab countries loaded:', countries);
      },
      error: (error) => {
        console.error('Error loading Arab countries:', error);
        this.channels = [];
      }
    });
  }

  loadChannels(): void {
    this.isLoading = true;
    this.channelService.getChannels(this.selectedCountry, this.searchTerm)
      .subscribe({
        next: (response: ChannelResponse) => {
          console.log('Channels response:', response);
          this.channels = (response.channels || []).map(channel => ({
            channel_name: channel.channel_name || 'غير متوفر',
            logo: channel.logo,
            satellite_info: channel.satellite_info || [],
            technical_info: channel.technical_info || [],
            metadata: channel.metadata || { country: null, scraped_at: null, source: null }
          }));
          console.log('Channels assigned:', this.channels);
          console.log('First channel (if exists):', this.channels[0]);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading channels:', error);
          this.isLoading = false;
          this.channels = [];
        }
      });
  }

  filterByCountry(country: string | null): void {
    this.selectedCountry = country;
    if (country === null) {
      this.searchTerm = null;
    }
    this.loadChannels();
  }

  searchChannels(): void {
    this.loadChannels();
  }
}
