import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStorageService } from '../../services/auth-storage';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  logout(): void {
    this.authStorage.clear();

    void this.router.navigate(['/login']);
  }
}
