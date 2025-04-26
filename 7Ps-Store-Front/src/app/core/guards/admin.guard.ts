import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export class AdminGuard implements CanActivate {
  toastr: any;
  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.notificationService.error('يجب تسجيل الدخول أولاً');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode<any>(token);
      if (decodedToken.role !== 'admin') {
        this.notificationService.error('ليس لديك صلاحيات للوصول لهذه الصفحة');
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      this.notificationService.error('جلسة منتهية، يرجى تسجيل الدخول مجدداً');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
function jwtDecode<T>(token: string) {
  throw new Error('Function not implemented.');
}

