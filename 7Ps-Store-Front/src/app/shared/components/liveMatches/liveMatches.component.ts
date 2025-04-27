import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../../core/services/match.service';
import { Match, Channel,Competition } from '../../../models/match.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liveMatches.component.html',
  styleUrl: './liveMatches.component.css'
})
export class LiveMatchesComponent implements OnInit {
  matches: Match | null = null;
  loading = true;
  error = '';

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  toggleCompetition(competition:Competition): void {
    competition.showMatches = !competition.showMatches;
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
        if (this.matches && this.matches.competitions) {
          this.matches.competitions.forEach(competition => {
            competition.showMatches = true; // Initialize competition collapse state
            competition.matches.forEach(matchGroup => {
              matchGroup.matches.forEach(match => {
                (match as any).showChannels = false;
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
