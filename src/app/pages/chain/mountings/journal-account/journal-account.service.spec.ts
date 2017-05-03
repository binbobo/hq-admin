import { TestBed, inject } from '@angular/core/testing';

import { JournalAccountService } from './journal-account.service';

describe('JournalAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalAccountService]
    });
  });

  it('should ...', inject([JournalAccountService], (service: JournalAccountService) => {
    expect(service).toBeTruthy();
  }));
});
