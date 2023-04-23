import {
  ComponentRef,
  Injectable,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ModalContainerComponent } from '../components/modal-container/modal-container.component';

interface IModal {
  data: any;
  popupComponent: any;
}

@Injectable()
export class ModalServiceService implements OnInit {
  public modalHost: ViewContainerRef | undefined;
  private activeModal: ComponentRef<ModalContainerComponent> | undefined;
  public activeModalVCR: ViewContainerRef | undefined;
  public data: any;
  private popup: any;

  constructor() {}

  setModalHost(modalHost: ViewContainerRef): void {
    this.modalHost = modalHost;
  }
  ngOnInit(): void {}

  public setContainerHost() {
    this.modalHost?.clear();
    this.activeModal = this.modalHost?.createComponent(ModalContainerComponent);
  }

  open(modal: IModal): void {
    setTimeout(() => {
      // <-- avoid Error: NG0100
      this.data = modal.data;
      this.popup = modal.popupComponent;
      this.setContainerHost();
      this.activeModal?.instance.open(this.popup, this.data);
    });
  }

  public close(): void {
    this.data = {};
    this.activeModal?.destroy();
  }

  public setData(data: any): void {
    this.data = data;
  }
  public getData(): any {
    return this.data;
  }
}
