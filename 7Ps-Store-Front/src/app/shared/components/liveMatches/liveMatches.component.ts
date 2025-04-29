import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../../core/services/match.service';
import { AuthService } from '../../../core/services/auth.service';
import { Match, Channel,Competition,MatchDetails } from '../../../models/match.model';
import { RouterModule } from '@angular/router';
import { AdsDisplayComponent } from '../ads-display/ads-display.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,AdsDisplayComponent],
  templateUrl: './liveMatches.component.html',
  styleUrl: './liveMatches.component.css'
})
export class LiveMatchesComponent implements OnInit {
  matches: Match | null = null;
  loading = true;
  error = '';
  isLoggedIn = false;

  constructor(private matchService: MatchService,private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    // this.loadMatches();
    if (!this.isLoggedIn) {
      // If not logged in, still show competitions but hide times
      this.loadMatches();
    } else {
      this.loadMatches();
    }
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
            competition.showMatches = true;
            competition.matches.forEach(matchGroup => {
              matchGroup.matches.forEach((match: MatchDetails) => {
                Object.assign(match, {
                  showChannels: false,
                  showFreeChannels: false,
                  showPaidChannels: false
                });
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

  toggleCategory(match: MatchDetails, type: 'free' | 'paid'): void {
    if (type === 'free') {
      match.showFreeChannels = !match.showFreeChannels;
    } else {
      match.showPaidChannels = !match.showPaidChannels;
    }
  }
}
