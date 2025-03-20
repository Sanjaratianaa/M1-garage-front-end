// AuthGuard
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthentificationService } from '../services/authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthentificationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    console.log('AuthGuard - Token:', token); // Add this line

    if (token) {
      console.log('AuthGuard - Allowed Access'); // Add this line
      // Token exists, allow access to the route
      return true;
    } else {
      console.log('AuthGuard - Redirecting to Login'); // Add this line
      // No token, redirect to the login page
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}