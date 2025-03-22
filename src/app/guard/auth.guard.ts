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

    if (token) {
      console.log('AuthGuard - Allowed Access');
      // Token exists, allow access to the route
      return true;
    } else {
      console.log('AuthGuard - Redirecting to Login');
      // No token, redirect to the login page
      this.router.navigate(['/authentication/login']); // Corrected redirect
      return false;
    }
  }
}