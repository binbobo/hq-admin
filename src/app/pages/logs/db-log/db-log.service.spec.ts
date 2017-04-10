import { TestBed, inject } from '@angular/core/testing';

import { DbLogService } from './db-log.service';

describe('DbLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbLogService]
    });
  });

  it('should ...', inject([DbLogService], (service: DbLogService) => {
    expect(service).toBeTruthy();
  }));
});
