import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';

import { AuthService } from '../auth.service';
import { AuthStorageService } from '../../../core/services/auth-storage';

@Component({
  selector: 'app-loading',
  imports: [ProgressSpinner],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const token = this.authStorage.getAccessToken();

    if (!token) {
      void this.router.navigate(['/login']);
      return;
    }

    this.authService.authorize().subscribe({
      next: () => {
        void this.router.navigate(['/posts']);
      },
      error: () => {
        this.authStorage.clear();
        void this.router.navigate(['/login']);
      },
    });
  }
}