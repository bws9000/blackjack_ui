import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css']
})
export class PlayerHandComponent implements OnInit {
  @Input() player: string;

  constructor() { }

  ngOnInit() {
  }

}
