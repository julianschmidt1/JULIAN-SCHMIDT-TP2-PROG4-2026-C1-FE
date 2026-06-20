import { Component, inject } from '@angular/core';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-my-profile',
  imports: [DatePipe],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile {
  private readonly authStorage = inject(AuthStorageService);

  readonly user = this.authStorage.getUser();

  readonly roleLabels: Record<string, string> = {
    user: 'Usuario',
    administrator: 'Administrador',
  };
}