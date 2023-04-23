import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalHostDirective } from '../../directives/modal-host.directive';

@Component({
  selector: 'app-host-container',
  template: `
    <ng-container modalHost></ng-container>
  `
})
export class HostContainerComponent implements AfterViewInit{

  @ViewChild(ModalHostDirective, {static: true}) modalHost!: ModalHostDirective;
  modalHostView: ViewContainerRef | undefined;

  constructor() {}

  ngAfterViewInit(): void {}

}
