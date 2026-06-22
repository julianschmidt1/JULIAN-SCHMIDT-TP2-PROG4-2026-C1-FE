import { Component, output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { PostResponse } from '../../models/post-response';
import { PostsService } from '../../posts.service.';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, InputText, ButtonDirective, Dialog],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePostComponent {
  private readonly fb = inject(FormBuilder);
  private readonly postsService = inject(PostsService);
  private readonly messageService = inject(MessageService);
  readonly postCreated = output<PostResponse>();

  createDialogVisible = signal(false);
  selectedFile: File | null = null;
  selectedFileName = '';

  readonly postForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
  });

  openCreateDialog(): void {
    this.createDialogVisible.set(true);
  }

  closeCreateDialog(): void {
    this.createDialogVisible.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  createPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formValue = this.postForm.getRawValue();
    const formData = new FormData();

    formData.append('title', formValue.title);
    formData.append('description', formValue.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.postsService.create(formData).subscribe({
      next: (post) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'La publicación se creó correctamente.',
        });

        this.postForm.reset();
        this.selectedFile = null;
        this.selectedFileName = '';
        this.createDialogVisible.set(false);

        this.postCreated.emit(post);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la publicación.',
        });
      },
    });
  }
}