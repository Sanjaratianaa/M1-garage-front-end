import { Routes } from '@angular/router';
// pages
import { MarqueComponent } from "./marque/marque.component";
import { ModeleComponent } from './modele/modele.component';
import { CategorieComponent } from './categorie/categorie.component';
import { TypeTransmissionComponent } from './type-transmission/typeTransmission.component';

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
      {
        path: 'categorie',
        component: CategorieComponent,
      },
      {
        path: 'type-transmission',
        component: TypeTransmissionComponent,
      },
    ],
  },
];
