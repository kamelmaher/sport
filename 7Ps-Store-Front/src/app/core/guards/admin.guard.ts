import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const token = localStorage.getItem('token');
  if (!token) {
    notificationService.error('يجب تسجيل الدخول أولاً');
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.role !== 'admin') {
      notificationService.error('ليس لديك صلاحيات للوصول لهذه الصفحة');
      router.navigate(['/home']);
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    notificationService.error('جلسة منتهية، يرجى تسجيل الدخول مجدداً');
    router.navigate(['/login']);
    return false;
  }
};
