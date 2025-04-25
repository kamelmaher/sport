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
    { title: 'الترددات', path: '/channels' },
    { title: 'المباريات', path: '/matches' },
    { title: 'سياسة الخصوصية', path: '/privacy' },
    { title: 'شروط الاستخدام', path: '/terms' },
    { title: 'اتصل بنا', path: '/contact' }
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com' },
    { icon: 'fab fa-telegram', url: 'https://telegram.org' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
