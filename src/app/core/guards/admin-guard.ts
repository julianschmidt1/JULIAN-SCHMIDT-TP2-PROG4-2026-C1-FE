import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage';

export const adminGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  const user = authStorage.getUser();

  if (user?.role === 'administrator') {
    return true;
  }

  return router.createUrlTree(['/posts']);
};