import { TestBed } from '@angular/core/testing';

import { InitAppService } from './init-app.service';

describe('InitAppService', () => {
  let service: InitAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
