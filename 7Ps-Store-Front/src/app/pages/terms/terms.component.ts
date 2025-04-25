import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { TermsChildComponent } from "../../shared/components/terms-child/terms-child.component";

@Component({
  selector: 'app-terms',
  imports: [HeaderComponent, FooterComponent, TermsChildComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {

}
