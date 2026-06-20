import { Routes } from '@angular/router';

import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Public
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  // Private
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'posts',
        loadComponent: () =>
          import('./features/posts/posts-page/posts-page').then(
            (m) => m.PostsPage,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/my-profile/my-profile').then(
            (m) => m.MyProfile,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];