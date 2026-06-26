import { Routes } from '@angular/router';

import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // Public
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full',
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('./features/auth/loading/loading').then((m) => m.Loading),
  },
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
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
        path: 'posts/:id',
        loadComponent: () =>
          import('./features/posts/post-detail/post-detail').then(
            (m) => m.PostDetail,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/my-profile/my-profile').then(
            (m) => m.MyProfile,
          ),
      },
      {
        path: 'dashboard/users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/users-dashboard/users-dashboard').then(
            (m) => m.UsersDashboard,
          ),
      },
      {
        path: 'dashboard/statistics',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/statistics-dashboard/statistics-dashboard').then(
            (m) => m.StatisticsDashboard,
          ),
      },
    ],
  },
];