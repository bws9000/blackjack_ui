import { Component } from '@angular/core';
import { ModalService } from '../../../modules/modal-dialog/modal.service';

@Component({
  selector: 'app-validate-human',
  templateUrl: './validate-human.component.html',
  styleUrls: ['./validate-human.component.scss']
})
export class ValidateHumanComponent{

  public data: any;

  constructor(private modalService: ModalService) {
    this.data = this.modalService.getData();
  }

  public close(): void {
    this.modalService.close();
  }

}
