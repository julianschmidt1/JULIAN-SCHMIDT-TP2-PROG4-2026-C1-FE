import { Component, inject, signal } from '@angular/core';

import { UserResponse } from '../../auth/models/user-response';
import { UsersService } from '../users.service';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { RoleLabelPipe } from '../../../shared/pipes/role-label-pipe';
import { UserStatusPipe } from '../../../shared/pipes/user-status-pipe';
import { FullNamePipe } from '../../../shared/pipes/full-name-pipe';
import { HighlightOnHoverDirective } from '../../../shared/directives/highlight-on-hover';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus';
import { RoleBadgeDirective } from '../../../shared/directives/role-badge';

@Component({
  selector: 'app-users-dashboard',
  imports: [
    ReactiveFormsModule,
    Dialog,
    InputText,
    ButtonDirective,
    RoleLabelPipe,
    UserStatusPipe,
    FullNamePipe,
    HighlightOnHoverDirective,
    AutoFocusDirective,
    RoleBadgeDirective
  ],
  templateUrl: './users-dashboard.html',
  styleUrl: './users-dashboard.scss',
})
export class UsersDashboard {
  private readonly usersService = inject(UsersService);
  readonly users = signal<UserResponse[]>([]);
  readonly loading = signal(false);
  private readonly authStorage = inject(AuthStorageService);
  readonly currentUser = this.authStorage.getUser();
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  selectedFile: File | null = null;
  selectedFileName = '';

  readonly createUserDialogVisible = signal(false);

  openCreateUserDialog(): void {
    this.createUserDialogVisible.set(true);
  }

  closeCreateUserDialog(): void {
    this.createUserDialogVisible.set(false);
  }

  readonly createUserForm = this.fb.nonNullable.group({
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
    birthDate: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(300)]],
    role: ['user', Validators.required],
  });

  isCurrentUser(user: UserResponse): boolean {
    return this.currentUser?.id === user.id;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  createUser(): void {
    if (this.createUserForm.invalid || !this.selectedFile) {
      this.createUserForm.markAllAsTouched();

      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Tenés que seleccionar una foto de perfil.',
        });
      }

      return;
    }

    const formValue = this.createUserForm.getRawValue();
    const formData = new FormData();

    Object.entries(formValue).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('profileImage', this.selectedFile);

    this.usersService.create(formData).subscribe({
      next: (createdUser) => {
        this.users.update((users) => [createdUser, ...users]);
        this.createUserForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          birthDate: '',
          description: '',
          role: 'user',
        });

        this.selectedFile = null;
        this.selectedFileName = '';

        this.messageService.add({
          severity: 'success',
          summary: 'Usuario creado',
          detail: 'El usuario fue creado correctamente.',
        });
        this.closeCreateUserDialog();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el usuario.',
        });
      },
    });
  }

  loadUsers(): void {
    this.loading.set(true);

    this.usersService.findAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  disableUser(user: UserResponse): void {
    this.usersService.disable(user.id).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((currentUser) =>
            currentUser.id === updatedUser.id ? updatedUser : currentUser,
          ),
        );
      },
    });
  }

  restoreUser(user: UserResponse): void {
    this.usersService.restore(user.id).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((currentUser) =>
            currentUser.id === updatedUser.id ? updatedUser : currentUser,
          ),
        );
      },
    });
  }
}