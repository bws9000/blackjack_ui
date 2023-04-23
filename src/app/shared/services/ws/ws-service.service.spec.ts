import { TestBed } from '@angular/core/testing';

import { WsServiceService } from './ws-service.service';

describe('WsServiceService', () => {
  let service: WsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
