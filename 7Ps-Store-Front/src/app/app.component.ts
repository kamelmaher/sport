import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelsComponent } from "./pages/channels/channels.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '7Ps-Store-Front';
}
