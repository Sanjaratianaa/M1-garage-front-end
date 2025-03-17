import { Routes } from '@angular/router';
// pages
import { MarqueComponent } from "./marque/marque.component";
import { ModeleComponent } from './modele/modele.component';

export const VoitureRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'marque',
        component: MarqueComponent,
      },
      {
        path: 'modele',
        component: ModeleComponent,
      },
    ],
  },
];
