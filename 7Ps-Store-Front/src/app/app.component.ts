import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChannelsComponent } from "./pages/channels/channels.component";
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '7Ps Store';
  constructor(private router: Router) { }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/error';
  }
}
