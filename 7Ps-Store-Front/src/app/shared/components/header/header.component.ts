import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // ngOnInit(): void {
  //   this.authService.getCurrentUser().subscribe((user: any) => {
  //     this.isLoggedIn = !!user;
  //     this.isAdmin = this.authService.isAdmin();
  //   });
  // }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  //   this.mobileMenuOpen = false;
  // }
}
