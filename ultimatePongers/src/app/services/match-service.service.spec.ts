import { TestBed } from '@angular/core/testing';

import { MatchServiceService } from './match-service.service';

describe('MatchServiceService', () => {
  let service: MatchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
