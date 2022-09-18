import {
  AfterViewInit,
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef } from '@angular/core';
import { ValidateHumanComponent } from 'src/app/shared/components/dialogs/validate-human/validate-human.component';
import { ModalDirective } from '../modal.directive';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss']
})
export class ContentContainerComponent implements AfterViewInit{

  @ViewChild(ModalDirective, {static: true}) dialogHost!: ModalDirective;

  activeModal:ComponentRef<any>;
  containerRef:ComponentRef<any>;
  instance:any;
  testOptions:any;

  private dialogHostLoaded:ViewContainerRef;

  constructor(private modalService: ModalService){
    this.testOptions = {"title":"Modal Title", "body":"Modal body message."};
    this.modalService.setData(this.testOptions);
  }

  open(component:any,options:any):void {}

  ngAfterViewInit() {
    const x = this.dialogHost.viewContainerRef;
    x.clear();
    x.createComponent(ValidateHumanComponent);
  }
}
