import { TestBed, inject } from '@angular/core/testing';

import { SalesReturnService } from './sales-return.service';

describe('SalesReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesReturnService]
    });
  });

  it('should ...', inject([SalesReturnService], (service: SalesReturnService) => {
    expect(service).toBeTruthy();
  }));
});
