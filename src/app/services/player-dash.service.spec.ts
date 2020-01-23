import { TestBed } from '@angular/core/testing';

import { PlayerDashService } from './player-dash.service';

describe('PlayerDashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerDashService = TestBed.get(PlayerDashService);
    expect(service).toBeTruthy();
  });
});
