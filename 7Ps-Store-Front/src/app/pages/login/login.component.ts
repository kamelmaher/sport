import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading = false;

  constructor(private router: Router) { }

  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10,12}$/)
    ])
  });

  formCheck() {
    if (this.loginForm.valid) {
      if (this.isLoading) return;

      this.isLoading = true;
      const name = this.loginForm.controls['name'].value || '';
      const phone = this.loginForm.controls['phone'].value || '';

      // Simulate authentication logic
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/channels']);
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
