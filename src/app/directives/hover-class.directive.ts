import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[hover-class]'
})
export class HoverClassDirective {

  constructor(public elementRef:ElementRef) { }
  @Input('hover-class') hoverClass: string;  

  @HostListener('mouseenter') onMouseEnter() {
    this.hoverClass.split(' ').forEach((value, index, array) => this.elementRef.nativeElement.classList.add(value));
 }

  @HostListener('mouseleave') onMouseLeave() {
    this.hoverClass.split(' ').forEach((value, index, array) => this.elementRef.nativeElement.classList.remove(value));
  }

}