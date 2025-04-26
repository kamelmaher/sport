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
  isPending = false;
  isRejected = false;
  errorMessage = '';

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
    this.isPending = false;
    this.isRejected = false;
    this.isLoading = true;
    this.errorMessage = ''; // إعادة تعيين رسالة الخطأ
    const { name, phone } = this.loginForm.value;

    this.authService.login(name!, phone!).subscribe({
      next: (response) => {
        this.isLoading = false;

        // التحقق من حالة pending
        if (response.status === 'pending') {
          this.isPending = true;
          return;
        }
        if (response.status === 'rejected') {
          this.isRejected = true;
          return;
        }

        if (response.token) {
          localStorage.setItem('token', JSON.stringify(response.token));
          localStorage.setItem('role', JSON.stringify(response.role));
          this.router.navigate(['/channels']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isPending = false;
        this.isRejected = false;
        this.errorMessage = error.error?.error || 'حدث خطأ أثناء تسجيل الدخول';
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
