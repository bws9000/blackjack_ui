import {Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[modalHost]',
})
export class ContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
