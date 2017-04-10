import { TestBed, inject } from '@angular/core/testing';

import { UsualLogService } from './usual-log.service';

describe('UsualLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsualLogService]
    });
  });

  it('should ...', inject([UsualLogService], (service: UsualLogService) => {
    expect(service).toBeTruthy();
  }));
});
