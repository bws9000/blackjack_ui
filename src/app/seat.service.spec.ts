import { TestBed } from '@angular/core/testing';

import { SeatService } from './seat.service';

describe('SeatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeatService = TestBed.get(SeatService);
    expect(service).toBeTruthy();
  });
});
