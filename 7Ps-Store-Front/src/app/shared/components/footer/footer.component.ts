import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  footerLinks = [
    { title: 'الرئيسية', path: '/' },
    { title: 'القنوات', path: '/channels' },
    { title: 'المباريات', path: '/home' },
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/profile.php?id=61574241051727&mibextid=wwXIfr&rdid=WEgvwrOajQfgGLpJ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15zya4vD4t%2F%3Fmibextid%3DwwXIfr' },
    { icon: 'fab fa-instagram', url: 'https://www.instagram.com/7ps_store_/' },
    { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@7ps_store' },
    { icon: 'fa-brands fa-tiktok', url: 'https://www.tiktok.com/@7ps_store' },
    { icon: 'fa-brands fa-phoenix-framework', url: 'https://7ps-oman.com' },
    { icon: 'fa-brands fa-snapchat', url: 'https://www.snapchat.com/add/store_7ps' },
    { icon: 'fab fa-whatsapp', url: 'https://api.whatsapp.com/send/?phone=96892415103&text&type=phone_number&app_absent=0' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
