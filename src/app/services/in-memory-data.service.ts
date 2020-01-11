import {InMemoryDbService} from "angular-in-memory-web-api";
import Table from '../Table';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tables = [
      {
        "_id": "15467", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "23456", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "36677", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "54657", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "55634", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "62345", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "75476", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "86789", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      },
      {
        "_id": "95674", "displayname": "table1", "name": "pluto 1",
        "creator": "guest2", "date": "some date1"
      }
    ];
    return {tables};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.

  /*
  genId(tables: Table[]): number {
    return tables.length > 0 ?
      Math.max(...tables.map(table => table._id)) + 1 : 11;
  }
  */
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
