import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

@Directive({
  selector: '[appRoleBadge]',
  standalone: true,
})
export class RoleBadgeDirective implements OnChanges {
  @Input() appRoleBadge = '';

  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  ngOnChanges(): void {
    this.applyBaseStyles();

    if (this.appRoleBadge === 'administrator') {
      this.element.style.background = 'rgb(14 165 183 / 15%)';
      this.element.style.color = 'var(--brand-light)';
      this.element.style.border = '1px solid rgb(14 165 183 / 35%)';
      return;
    }

    this.element.style.background = 'rgb(148 163 184 / 15%)';
    this.element.style.color = 'var(--text-secondary)';
    this.element.style.border = '1px solid rgb(148 163 184 / 25%)';
  }

  private applyBaseStyles(): void {
    this.element.style.display = 'inline-block';
    this.element.style.padding = '6px 14px';
    this.element.style.borderRadius = '999px';
    this.element.style.fontSize = '0.8rem';
    this.element.style.fontWeight = '600';
  }
}