import { TestBed } from '@angular/core/testing';

import { PlayerServiceService } from './player-service.service';

describe('PlayerServiceService', () => {
  let service: PlayerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
