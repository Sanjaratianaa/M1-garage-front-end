import { Routes } from '@angular/router';
import { RendezVousComponent } from './rendez-vous.component';
import { RendezVousDetailComponent } from './rendez-vous-detail/rendez-vous-detail.component';
// pages

export const RendezVousRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RendezVousComponent,
      },
      {
        path: ':id',
        component: RendezVousDetailComponent,
      },
    ],
  }, 
];
