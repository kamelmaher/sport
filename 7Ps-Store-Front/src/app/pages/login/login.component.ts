import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) { }

  loginForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(/^[\u0600-\u06FF\u0750-\u077F\s]+$/)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10,15}$/)
    ])
  });

  formCheck() {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { name, phone } = this.loginForm.value;

    console.log(name, phone);
    this.authService.login(name!, phone!).subscribe({
      next: (response) => {
        console.log(name, phone);
        console.log('Login response:', response);
        localStorage.setItem('token', JSON.stringify(response?.token));
        this.router.navigate(['/channels']);
      },
      error: (error) => {
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
