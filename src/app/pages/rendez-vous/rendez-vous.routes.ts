import { Routes } from '@angular/router';
import { RendezVousComponent } from './rendez-vous.component';
// pages

export const RendezVousRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RendezVousComponent,
      },
    ],
  },
];
