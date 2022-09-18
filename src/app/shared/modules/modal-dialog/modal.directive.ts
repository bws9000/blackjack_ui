import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dialogHost]',
})
export class ModalDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
