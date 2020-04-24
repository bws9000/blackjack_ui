import {Component, OnInit, Inject, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  checked: boolean;
}

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.css']
})
export class DialogExampleComponent implements OnInit {

  dealCardMode: string;
  color: any;
  checked: boolean;
  disabled: boolean;

  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>
    , @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.color = 'accent';
    this.checked = data.checked;
    this.disabled = false;
    this.toggleChange();
  }

  toggleChange() {
    if(this.data.checked){
      this.dealCardMode = 'on';
    }else{
      this.dealCardMode = 'off';
    }
  }

  getDealCardMode() {
    return this.dealCardMode;
  }

  ngOnInit() {
  }

}
