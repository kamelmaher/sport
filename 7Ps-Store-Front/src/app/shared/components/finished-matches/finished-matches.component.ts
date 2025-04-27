import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../../core/services/match.service';
import { FinishedMatchesResponse,FinishedMatch,FinishedCompetition } from '../../../models/match.model';

@Component({
  selector: 'app-finished-matches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finished-matches.component.html',
  styleUrl: './finished-matches.component.css'
})
export class FinishedMatchesComponent implements OnInit {
  finishedMatches: FinishedMatchesResponse | null = null;
  loading = true;
  error = '';

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadFinishedMatches();
  }

  toggleCompetition(competition: FinishedCompetition): void {
    competition.showMatches = !competition.showMatches;
  }

  loadFinishedMatches(): void {
    this.matchService.getFinishedMatches().subscribe({
      next: (data) => {
        // Group matches by championship
        const groupedMatches = this.groupMatchesByChampionship(data.matches);
        this.finishedMatches = {
          date: data.date,
          matches: data.matches,
          competitions: groupedMatches
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load finished matches';
        this.loading = false;
      }
    });
  }

  private groupMatchesByChampionship(matches: FinishedMatch[]): FinishedCompetition[] {
    const grouped = matches.reduce((acc, match) => {
      if (!acc[match.championship]) {
        acc[match.championship] = [];
      }
      acc[match.championship].push(match);
      return acc;
    }, {} as { [key: string]: FinishedMatch[] });

    return Object.entries(grouped).map(([name, matches]) => ({
      name,
      matches,
      showMatches: true
    }));
  }
}
