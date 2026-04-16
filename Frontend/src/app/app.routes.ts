import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/motocicletas/motocicletas.routes').then(
        (m) => m.motocicletasRoutes,
      ),
  },
];
