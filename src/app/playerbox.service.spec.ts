import { TestBed } from '@angular/core/testing';

import { PlayerboxService } from './playerbox.service';

describe('PlayerboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerboxService = TestBed.get(PlayerboxService);
    expect(service).toBeTruthy();
  });
});
