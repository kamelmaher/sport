import { UserManagementComponent } from './shared/components/user-management/user-management.component';
import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { LoginComponent } from './pages/login/login.component';

import { LiveMatchesComponent } from './shared/components/liveMatches/liveMatches.component';
import { FinishedMatchesComponent } from './shared/components/finished-matches/finished-matches.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdsComponent } from './pages/ads/ads.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { ErrorComponent } from './shared/components/error/error.component';
export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LiveMatchesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'channels', component: ChannelsComponent, canActivate: [AuthGuard] },
  { path: 'ads', component: AdsComponent, canActivate: [adminGuard] },
  { path: 'user', component: UserManagementComponent, canActivate: [adminGuard] },
  { path: 'finished', component: FinishedMatchesComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' },
];


