import { Routes } from '@angular/router';
import { ChannelsComponent } from './pages/channels/channels.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'channels', component: ChannelsComponent },

];

