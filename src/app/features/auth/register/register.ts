import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputText,
    Password,
    ButtonDirective
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
      ],
    ],
    repeatPassword: ['', Validators.required],
    birthDate: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(300)]],
  });

  selectedFile: File | null = null;
  selectedFileName = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.selectedFile) {
      this.registerForm.markAllAsTouched();

      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Tenés que seleccionar una foto de perfil.',
        });
      }

      return;
    }

    const formValue = this.registerForm.getRawValue();

    if (formValue.password !== formValue.repeatPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Las contraseñas no coinciden.',
      });

      return;
    }

    const formData = new FormData();

    Object.entries(formValue).forEach(([key, value]) => {
      if (key !== 'repeatPassword') {
        formData.append(key, value);
      }
    });

    formData.append('profileImage', this.selectedFile);

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.authStorage.saveUser(response.user);
        this.authStorage.saveAccessToken(response.accessToken);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `¡Bienvenido, ${response.user.firstName}!`,
        });

        void this.router.navigate(['/posts']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo completar el registro.',
        });
      },
    });
  }

}
