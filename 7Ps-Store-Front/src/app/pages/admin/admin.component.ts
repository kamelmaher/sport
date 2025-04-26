import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { UserManagementComponent } from "../../shared/components/user-management/user-management.component";
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { AdsAdminComponent } from '../../shared/components/ads-admin/ads-admin.component';

@Component({
  selector: 'app-admin',
  imports: [FooterComponent, HeaderComponent, AdsAdminComponent, UserManagementComponent, NotificationComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
