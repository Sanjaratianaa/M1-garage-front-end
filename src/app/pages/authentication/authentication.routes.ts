import { Routes } from '@angular/router';
import { NoAuthGuard } from 'src/app/guard/no-auth.guard';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppResetPasswordComponent } from './reset-password/reset-password.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: 'login',
    component: AppSideLoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'resetPassword',
    component: AppResetPasswordComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    component: AppSideRegisterComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: '',  // Add this: default route within authentication
    redirectTo: 'login',
    pathMatch: 'full'
  }
];