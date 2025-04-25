import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PrivacyChildComponent } from "../../shared/components/privacy-child/privacy-child.component";

@Component({
  selector: 'app-privacy',
  imports: [HeaderComponent, FooterComponent, PrivacyChildComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {

}
