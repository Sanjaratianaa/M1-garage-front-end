import { Routes } from '@angular/router';
import { HistoriqueRendezVousComponent } from './historique-rendez-vous/historique-rendez-vous.component';
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';
// pages

export const RendezVousRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'historique-demande',
        component: HistoriqueRendezVousComponent,
      },
      {
        path: '',
        component: RendezVousComponent,
      },
      {
        path: ':status',
        component: HistoriqueRendezVousComponent,
      },
    ],
  },
];
