import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  private readonly element = inject(ElementRef<HTMLInputElement>).nativeElement;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.element.focus();
    });
  }
}