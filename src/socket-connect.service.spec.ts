import { TestBed } from '@angular/core/testing';

import { SocketConnectService } from './socket-connect.service';

describe('SocketConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketConnectService = TestBed.get(SocketConnectService);
    expect(service).toBeTruthy();
  });
});
