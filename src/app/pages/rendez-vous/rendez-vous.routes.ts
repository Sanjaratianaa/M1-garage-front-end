import { Routes } from '@angular/router';
import { RendezVousComponent } from './rendez-vous.component';
import { RendezVousDetailComponent } from './rendez-vous-detail/rendez-vous-detail.component';
import { RendezVousInterventionComponent } from './intervention/rendez-vous-intervention.component';
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
        path: 'interventions',
        component: RendezVousInterventionComponent,
        // children: [
        //   {
        //     path: ':id',
        //     component: RendezVousInterventionComponent
        //   }
        // ]
      },
      {
        path: ':id',
        component: RendezVousDetailComponent,
      },
    ],
  }, 
];
