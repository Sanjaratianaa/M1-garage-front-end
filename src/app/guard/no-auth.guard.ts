import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token, allow access to login/register
      console.log('NoAuthGuard - Allowed Access'); // Add this line

      return true;
    } else {
      console.log('NoAuthGuard - Redirecting to Login'); // Add this line

      // Token exists, redirect to dashboard (or wherever you want)
      this.router.navigate(['/']);
      return false;
    }
  }
}