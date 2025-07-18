import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): boolean {
    // const token = localStorage.getItem('authToken');

    if (this.authService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

}
