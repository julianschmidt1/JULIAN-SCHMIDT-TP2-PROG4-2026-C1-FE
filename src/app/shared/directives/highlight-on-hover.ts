import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHighlightOnHover]',
  standalone: true,
})
export class HighlightOnHoverDirective {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.element.style.transform = 'translateY(-2px)';
    this.element.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.25)';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.element.style.transform = '';
    this.element.style.boxShadow = '';
  }
}