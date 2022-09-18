import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDirective } from './modal.directive';
import { ContentContainerComponent } from './component/content-container.component';
import { ModalService } from './modal.service';
import { ContainerDirective } from './container.directive';

@NgModule({
  declarations: [
    ModalDirective,
    ContainerDirective,
    ContentContainerComponent
  ],
  exports: [
    ContainerDirective
  ],
  imports: [
    CommonModule
  ],
  entryComponents:[ContentContainerComponent],
  providers: [ModalService, ContentContainerComponent]
})
export class ModalDialogModule { }
