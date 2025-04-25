import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ContactChildComponent } from '../../shared/components/contact-child/contact-child.component';

@Component({
  selector: 'app-contact',
  imports: [HeaderComponent, FooterComponent, ContactChildComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
