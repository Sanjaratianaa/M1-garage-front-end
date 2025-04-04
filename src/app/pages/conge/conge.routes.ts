import { Routes } from '@angular/router';
import { DemandeCongeComponent } from './demande-conge/demande-conge.component';
// pages

export const CongeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DemandeCongeComponent,
      },
    ],
  },
];
