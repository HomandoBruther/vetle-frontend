import { Routes } from '@angular/router';

// loadComponent = lazy loading: each page's code is split into its own file
// and only downloaded when the user first visits that route.
export const routes: Routes = [
  {
    path: '',
    title: 'Vetle',
    loadComponent: () => import('./home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'projects',
    title: 'Projects | Vetle',
    loadComponent: () =>
      import('./projects/projects-page/projects-page').then((m) => m.ProjectsPage),
  },
  // Any unknown URL goes back to the home page.
  { path: '**', redirectTo: '' },
];
