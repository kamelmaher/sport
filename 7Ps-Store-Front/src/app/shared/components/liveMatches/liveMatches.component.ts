import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../../core/services/match.service';
import { Match, Channel, Competition, MatchDetails } from '../../../models/match.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-live-matches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liveMatches.component.html',
  styleUrl: './liveMatches.component.css'
})
export class LiveMatchesComponent implements OnInit {
  matches: Match | null = null;
  loading = true;
  error = '';
  isLogined = false;
  // Track which channel's tooltip is visible on mobile
  activeTooltip: { matchKey: string, channelName: string } | null = null;
  // Map to store unique keys for matches
  matchKeys: Map<MatchDetails, string> = new Map();

  constructor(private matchService: MatchService, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.loadMatches();
    this.isLogined = this.AuthService.isLoggedIn();
  }

  toggleCompetition(competition: Competition): void {
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
                // Generate a unique key for the match
                const matchKey = this.generateMatchKey(match);
                this.matchKeys.set(match, matchKey);
                Object.assign(match, {
                  showChannels: false,
                  showFreeChannels: false,
                  showPaidChannels: false
                });
              });
            });
          });
        }
        if (this.matches && this.matches.competitions.length) {
          this.loading = false;
        }
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

  toggleChannels(match: MatchDetails): void {
    match.showChannels = !match.showChannels;
  }

  toggleCategory(match: MatchDetails, type: 'free' | 'paid'): void {
    if (type === 'free') {
      match.showFreeChannels = !match.showFreeChannels;
    } else {
      match.showPaidChannels = !match.showPaidChannels;
    }
  }

  // Toggle tooltip visibility on mobile
  toggleTooltip(match: MatchDetails, channel: Channel): void {
    if (!channel.frequency) return; // Do nothing if no frequency data

    const channelName = channel.name;
    const matchKey = this.matchKeys.get(match) || this.generateMatchKey(match);
    if (this.activeTooltip?.matchKey === matchKey && this.activeTooltip?.channelName === channelName) {
      this.activeTooltip = null; // Close tooltip if clicking the same channel
    } else {
      this.activeTooltip = { matchKey, channelName }; // Show tooltip for clicked channel
    }
  }

  // Generate a unique key for a match
  private generateMatchKey(match: MatchDetails): string {
    // Use a combination of match properties to create a unique key
    const keyBase = `${match.competition}-${match.teams}-${match.time}`;
    // Add a random suffix to handle potential duplicates
    return `${keyBase}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
