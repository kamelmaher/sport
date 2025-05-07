import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiveMatchesComponent } from "../liveMatches/liveMatches.component";
import { FinishedMatchesComponent } from "../finished-matches/finished-matches.component";
import { AuthService } from '../../../core/services/auth.service';
import { WebInfoComponent } from '../web-info/web-info.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterModule, LiveMatchesComponent, FinishedMatchesComponent, WebInfoComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
export class MatchesComponent implements OnInit {
  activeTab: 'live' | 'finished' = 'live';
  isLoggedIn = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleTab(tab: 'live' | 'finished'): void {
    this.activeTab = tab;
  }
}
