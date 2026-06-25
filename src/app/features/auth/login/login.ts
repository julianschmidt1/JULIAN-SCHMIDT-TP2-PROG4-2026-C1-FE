import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { AuthStorageService } from '../../../core/services/auth-storage';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputText,
    Password,
    ButtonDirective,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.authStorage.saveUser(response.user);
        this.authStorage.saveAccessToken(response.accessToken);

        void this.router.navigate(['/posts']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrectos.',
        });
      },
    });
  }
}
