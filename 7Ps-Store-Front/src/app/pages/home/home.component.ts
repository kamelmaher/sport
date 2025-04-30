import { Component } from '@angular/core';
import { AdsDisplayComponent } from '../../shared/components/ads-display/ads-display.component';
import { MatchesComponent } from '../../shared/components/matches/matches.component';

@Component({
  selector: 'app-home',
  imports: [AdsDisplayComponent, MatchesComponent,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
