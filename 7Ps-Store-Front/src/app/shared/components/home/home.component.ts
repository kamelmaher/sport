import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../../core/services/match.service';
import { Match, Channel } from '../../../models/match.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  matches: Match | null = null;
  loading = true;
  error = '';

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
        // Initialize showChannels property for each match
        if (this.matches && this.matches.competitions) {
          this.matches.competitions.forEach(competition => {
            competition.matches.forEach(matchGroup => {
              matchGroup.matches.forEach(match => {
                // Add showChannels property using type assertion
                (match as any).showChannels = false; // Start expanded
              });
            });
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  getFrequencyTooltip(channel: Channel): string {
    if (!channel.frequency) return '';
    
    return `
      Position: ${channel.frequency.position}
      Satellite: ${channel.frequency.satellite}
      Frequency: ${channel.frequency.frequency}
      Symbol Rate: ${channel.frequency.symbolRate}
      Encryption: ${channel.frequency.encryption}
    `;
  }

  toggleChannels(match: any): void {
    match.showChannels = !match.showChannels;
  }
}
