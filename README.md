A **protype** of an idea I had using HTML5 and CSS3 / Angular for the "moving parts" of a game instead of a canvas. Nodejs game server plays the game, client is static app on netlify communicates via websocket api.

# More info on DevPost
https://devpost.com/software/multiplayer-blackjack-game-and-service

# Websocket API
https://calm-eyrie-37824.herokuapp.com

https://github.com/bws9000/Blackjack-Angular-7-Client/blob/master/src/app/services/websocket.service.ts

    this.eventMap.set('getTablesEmit', new SocketObservable('getTablesEmit', this.socket))
    this.eventMap.set('getHandsEmit', new SocketObservable('getHandsEmit', this.socket));
    this.eventMap.set('initEmit', new SocketObservable('initEmit', this.socket));
    this.eventMap.set('memberOfRoomEmit', new SocketObservable('memberOfRoomEmit', this.socket));
    this.eventMap.set('joinTableEmit', new SocketObservable('joinTableEmit', this.socket));
    this.eventMap.set('addTableEmit', new SocketObservable('addTableEmit', this.socket));
    this.eventMap.set('leftTableEmit', new SocketObservable('leftTableEmit', this.socket));
    this.eventMap.set('standUpTableEmit', new SocketObservable('standUpTableEmit', this.socket));
    this.eventMap.set('satDownTableEmit', new SocketObservable('satDownTableEmit', this.socket));
    this.eventMap.set('openBetDashEmit', new SocketObservable('openBetDashEmit', this.socket));
    this.eventMap.set('dealCardEmit', new SocketObservable('dealCardEmit', this.socket));
    this.eventMap.set('openPlayerDashEmit', new SocketObservable('openPlayerDashEmit', this.socket));
    this.eventMap.set('actionStatusEmit', new SocketObservable('actionStatusEmit', this.socket));
    this.eventMap.set('playerActionEmit', new SocketObservable('playerActionEmit', this.socket));
    this.eventMap.set('actionSeatEmit', new SocketObservable('actionSeatEmit', this.socket));
    this.eventMap.set('dealerHandEmit', new SocketObservable('dealerHandEmit', this.socket));
    this.eventMap.set('restartHandsEmit', new SocketObservable('restartHandsEmit', this.socket));
    this.eventMap.set('checkDoneEmit', new SocketObservable('checkDoneEmit', this.socket));
    this.eventMap.set('initSplitEmit', new SocketObservable('initSplitEmit', this.socket));
    this.eventMap.set('getAllTablesEmit', new SocketObservable('getAllTablesEmit', this.socket));
    this.eventMap.set('getTableStateEmit', new SocketObservable('getTableStateEmit', this.socket));
    //ENVIRONMENT EVENTS
    this.eventMap.set('tableDetailHeartBeat', new SocketObservable('tableDetailHeartBeat', this.socket));
    this.eventMap.set('socketReconnect', new SocketObservable('socketReconnect', this.socket));
    this.eventMap.set('errorEmit', new SocketObservable('errorEmit', this.socket));
    this.eventMap.set('blankEmit', new SocketObservable('blankEmit', this.socket));
    this.eventMap.set('emptyEmit', new SocketObservable('emptyEmit', this.socket));
# Angulartemp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
