import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { LoginComponent } from './pages/login/login.component';
import { LiveMatchesComponent } from './shared/components/liveMatches/liveMatches.component';
import { FinishedMatchesComponent } from './shared/components/finished-matches/finished-matches.component';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: LiveMatchesComponent },
  { path: 'finished', component: FinishedMatchesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'channels', component: ChannelsComponent },

];

