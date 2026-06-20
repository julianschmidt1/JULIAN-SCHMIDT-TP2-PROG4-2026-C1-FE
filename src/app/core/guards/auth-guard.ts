import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage';

export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (authStorage.isAuthenticated()) {
    return true;
  }

  void router.navigate(['/login']);

  return false;
};