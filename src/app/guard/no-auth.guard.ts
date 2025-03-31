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
      console.log('NoAuthGuard - Allowed Access');
      return true;
    } else {
      console.log('NoAuthGuard - Redirecting to Dashboard');
      this.router.navigate(['/dashboard']); // Redirect to dashboard
      return false;
    }
  }
}