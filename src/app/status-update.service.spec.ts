import { TestBed } from '@angular/core/testing';

import { StatusUpdateService } from './status-update.service';

describe('StatusUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusUpdateService = TestBed.get(StatusUpdateService);
    expect(service).toBeTruthy();
  });
});
