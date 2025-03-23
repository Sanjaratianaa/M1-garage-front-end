import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
// pages

export const CalendarRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CalendarComponent,
      },
    ],
  },
];
