import {Component, OnInit, Inject, EventEmitter, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  multiPlayerChecked: boolean;
  dealCardChecked: boolean;
  shuffle: number;
  deckOption: number;
  multiPlayerOption: number;
}

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogExampleComponent implements OnInit {

  dealCardMode: string;
  multiPlayerMode: string;
  color: any;
  dealCardChecked: boolean;
  multiPlayerChecked: boolean;
  deckOption:number;
  shuffle:number;
  disabled: boolean;

  deckOptions = [
    new DeckOptions(1, 1 ),
    new DeckOptions(2, 2 ),
    new DeckOptions(6, 6 ),
    new DeckOptions(8, 8 )
  ];

  shuffleAt = [
    new ShuffleAt(50, '50%' ),
    new ShuffleAt(75, '75%' )
  ];

  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>
    , @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.color = 'accent';
    this.dealCardChecked = data.dealCardChecked;
    this.multiPlayerChecked = data.multiPlayerChecked;
    this.deckOption = data.deckOption;
    this.shuffle = data.shuffle;
    this.disabled = false;
    this.dealCardToggleChange();
    this.multiPlayerToggleChange();

    //default on state
    this.data.dealCardChecked = true;
    this.dealCardMode = 'on';
  }

  dealCardToggleChange() {
    if(this.data.dealCardChecked){
      this.dealCardMode = 'on';
    }else{
      this.dealCardMode = 'off';
    }
  }

  multiPlayerToggleChange() {
    this.multiPlayerMode = 'off';
    alert('Multi player mode is temporarily offline. Continuing in' +
      ' single player mode.');
  }

  getDealCardMode() {
    return this.dealCardMode;
  }

  getMultiPlayerMode() {
    return this.multiPlayerMode;
  }

  changeSources(value: any){
    alert(value);
  }

  ngOnInit() {
  }

}

export class DeckOptions {
  constructor(public id: number, public name: number) { }
}
export class ShuffleAt {
  constructor(public id: number, public name: string) { }
}
