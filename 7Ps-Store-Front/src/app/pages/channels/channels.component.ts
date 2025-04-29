import { Component } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AdsComponent } from "../ads/ads.component";
import { AdsDisplayComponent } from '../../shared/components/ads-display/ads-display.component';

@Component({
  selector: 'app-channels',
  imports: [SearchBarComponent, AdsDisplayComponent],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.css'
})
export class ChannelsComponent {

}
