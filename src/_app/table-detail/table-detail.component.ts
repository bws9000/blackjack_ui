import {AfterViewChecked, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {StatusUpdateService} from "../services/status-update.service";
import {SeatService} from "../services/seat.service";
import {TableService} from "../services/table.service";
import {PlatformLocation} from '@angular/common'
import {HandService} from "../services/hand.service";
import {PlaceBetsService} from "../services/place-bets.service";
import {Subscription} from "rxjs";
import {ControlService} from "../services/control.service";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})

export class TableDetailComponent implements OnInit, OnDestroy {

  @Input() player: string;

  watchers: any;
  players: any;
  playerSeats: Object;
  socketid: any;
  broadcast: any;
  tableNum: number;
  tableName: string;
  backButtonVisible:string;

  userSubscription: Subscription;
  shuffle: any;
  bank:number;


  constructor(private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private seatService: SeatService,
              private tableService: TableService,
              private handService: HandService,
              private router: Router,
              private _location: PlatformLocation,
              private placeBetsService: PlaceBetsService,
              private route: ActivatedRoute,
              private control: ControlService,
              private placeBetService: PlaceBetsService) {


    this.bank = 0;
    this.backButtonVisible = 'hidden';

    this.control.gamePosition = 2;

    this.playerSeats = {};

    this.statusUpdateService.hideNavBar(false);

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.tableName = params.tableId;

          this.statusUpdateService.watchersPlayers.subscribe(value => {
            let j = JSON.stringify(value);
            let o = JSON.parse(j);

            this.socketid = o.socketid;
            this.broadcast = o.broadcast;

            this.watchers = o.watcherCount;
            this.players = o.playerCount;

          });


        this.wss.emit('getTableState', {
          tableNum: this.tableService.tableNum
        });
        this.tableService.checkTableActive.subscribe((value)=>{
          this.wss.startChange.next(true);
          if(value !== undefined) {
            if (!value) {
              alert('This table is now closed.');
              this.router.navigate(['/tables']).then((r) => {
              });
            }
          }
        });

      });


  }

  leaveTable() {
    let table = this.tableService.tableNum;
    this.wss.emit('leaveTable', {
      table: table,
      socketid:this.wss.socketId
    });
    this.control.playerLeftGame = true;
  }

  memberOfRoomEmit(data) {
    this.wss.startChange.next(true);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    let table = this.tableService.tableNum;
    this.leaveTable();
    this.statusUpdateService.hideNavBar(true);
    this.userSubscription.unsubscribe();
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  getCardCount() {
    return this.handService.getCardCount();
  }
  getShuffleCount(){
    return this.handService.getShuffleCount();
  }
  getChips() {
    return this.placeBetService.currentBank;
  }

}
