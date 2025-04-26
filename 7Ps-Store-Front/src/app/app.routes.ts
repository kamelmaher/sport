import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdsComponent } from './pages/ads/ads.component';
export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'channels', component: ChannelsComponent, canActivate: [AuthGuard] },
  { path: 'ads', component: AdsComponent },
];


