import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthStorageService } from '../../services/auth-storage';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, OnDestroy {
  private readonly authStorage = inject(AuthStorageService);
  private readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  private sessionTimerId: ReturnType<typeof setTimeout> | null = null;

  readonly user = this.authStorage.getUser();

  ngOnInit(): void {
    this.startSessionTimer();
  }

  ngOnDestroy(): void {
    this.clearSessionTimer();
  }

  logout(): void {
    this.clearSessionTimer();
    this.authStorage.clear();
    void this.router.navigate(['/login']);
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();

    this.sessionTimerId = setTimeout(() => {
      this.showSessionExpirationModal();
    }, 10 * 60 * 1000);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimerId) {
      clearTimeout(this.sessionTimerId);
      this.sessionTimerId = null;
    }
  }

  private showSessionExpirationModal(): void {
    this.confirmationService.confirm({
      header: 'Sesión por expirar',
      message: 'Tu sesión vence en 5 minutos. ¿Querés extenderla?',
      acceptLabel: 'Extender sesión',
      rejectLabel: 'No extender',
      accept: () => {
        this.authService.refresh().subscribe({
          next: (response) => {
            this.authStorage.saveAccessToken(response.accessToken);
            this.startSessionTimer();

            this.messageService.add({
              severity: 'success',
              summary: 'Sesión extendida',
              detail: 'Tu sesión fue renovada por 15 minutos.',
            });
          },
          error: () => {
            this.logout();
          },
        });
      },
    });
  }
}