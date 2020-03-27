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

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})

export class TableDetailComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() player: string;

  watchers: any;
  players: any;
  playerSeats: Object;
  socketid: any;
  broadcast: any;
  tableNum: number;
  tableName: string;

  userSubscription: Subscription;


  constructor(private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private seatService: SeatService,
              private tableService: TableService,
              private handService: HandService,
              private router: Router,
              private location: PlatformLocation,
              private placeBetsService: PlaceBetsService,
              private route: ActivatedRoute) {


    this.playerSeats = {};
    this.tableService.setTableInstance();
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


      });
    ///////////////////////////////////////////////////////////////////
    this.placeBetsService.setVisible(false,
      this.seatService.currentSeat,this.tableService.tableNum);


    location.onPopState(() => {
      this.router.navigate(['/']).then((r) => {
        window.location.reload();
        //this.leaveTable();
      });
    });

  }

  leaveTable() {
    this.router.navigate(['']).then((r) => {
      let table = this.tableService.tableNum;
      this.wss.emit('leaveTable', {table: table});
      window.location.reload()
    });
  }

  memberOfRoomEmit(data) {
    this.wss.startChange.next(true);
    if (!data.member) {
      this.router.navigate(['/tables']).then((r) => {
        this.logStuff('no longer in room: ' + JSON.stringify(data));
      });
    }
  }

  ngOnInit() {

    if (this.wss.start) {

    } else {
      this.ngOnDestroy();
      this.router.navigate(['']).then((r) => {
        //do something...
      })
    }
  }

  ngOnDestroy() {
    //leave room/table
    let table = this.tableService.tableNum;
    //this.logStuff('NG ON DESTROY CALLED');
    this.wss.emit('leaveTable', {table: table});
    this.statusUpdateService.hideNavBar(true);
    this.userSubscription.unsubscribe();
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  ngAfterViewChecked(): void {
    //console.log('VIEWCHECKED');
  }

}
