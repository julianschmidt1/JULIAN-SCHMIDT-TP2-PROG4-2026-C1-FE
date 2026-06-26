import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { DatePipe } from '@angular/common';
import { PostCardComponent } from '../../posts/components/post-card/post-card';
import { PostsService } from '../../posts/posts.service.';
import { PostResponse } from '../../posts/models/post-response';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { UsersService } from '../users';
import { MessageService } from 'primeng/api';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus';


@Component({
  selector: 'app-my-profile',
  imports: [DatePipe, PostCardComponent, ButtonDirective,
    ReactiveFormsModule,
    Dialog,
    InputText,
    ButtonDirective,
    AutoFocusDirective,
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile implements OnInit {
  readonly fb = inject(FormBuilder);
  private readonly authStorage = inject(AuthStorageService);
  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);
  private readonly messageService = inject(MessageService);

  readonly user = signal(this.authStorage.getUser());
  readonly latestPosts = signal<PostResponse[]>([]);
  readonly loadingPosts = signal(false);
  readonly editDialogVisible = signal(false);

  selectedFile: File | null = null;
  selectedFileName = '';

  readonly profileForm = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    username: [''],
    birthDate: [''],
    description: [''],
  });

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  private loadLatestPosts(): void {
    if (!this.user) {
      return;
    }

    this.loadingPosts.set(true);

    this.postsService
      .findAll({
        sort: 'createdAt',
        offset: 0,
        limit: 3,
        userId: this.user()?.id,
      })
      .subscribe({
        next: (posts) => {
          this.latestPosts.set(posts);
          this.loadingPosts.set(false);
        },
        error: () => {
          this.loadingPosts.set(false);
        },
      });
  }

  saveProfile(): void {
    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();
    const formData = new FormData();

    Object.entries(formValue).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.usersService.update(currentUser.id, formData).subscribe({
      next: (updatedUser) => {
        this.authStorage.saveUser(updatedUser);
        this.user.set(updatedUser);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente.',
        });

        this.selectedFile = null;
        this.selectedFileName = '';
        this.editDialogVisible.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el perfil.',
        });
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  openEditDialog(): void {
    const user = this.user();

    if (!user) {
      return;
    }

    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      birthDate: user.birthDate.split('T')[0],
      description: user.description,
    });

    this.editDialogVisible.set(true);
  }
  closeEditDialog(): void {
    this.editDialogVisible.set(false);
  }

  readonly roleLabels: Record<string, string> = {
    user: 'Usuario',
    administrator: 'Administrador',
  } as const;

  getRoleLabel(role: string): string {
    return this.roleLabels[role as keyof typeof this.roleLabels] ?? role;
  }
}