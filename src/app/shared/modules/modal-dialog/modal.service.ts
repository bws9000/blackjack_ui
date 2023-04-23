import { ComponentRef, Injectable, ViewContainerRef } from "@angular/core";
import { ContentContainerComponent } from "./component/content-container.component";

@Injectable()
export class ModalService{

  private activeModal: ComponentRef<any>;
  private containerRef: ViewContainerRef;
  private data:object;

  constructor(){}

  public setContainerHost(cRef:ViewContainerRef){

      this.containerRef = cRef;
      this.containerRef.clear();
      this.activeModal = this.containerRef.createComponent(ContentContainerComponent);
  }

  public setData(data:object):void{
    this.data = data;
  }

  public getData():object{
    return this.data;
  }

  public close():void{
    this.data = {};
    this.activeModal.destroy();
  }

}
