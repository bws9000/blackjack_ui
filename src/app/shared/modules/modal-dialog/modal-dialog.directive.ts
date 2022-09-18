import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modalDialog]',
})
export class ModalDialogDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
