import { TestBed, inject } from '@angular/core/testing';

import { SuspendBillService } from './suspend-bill.service';

describe('SuspendBillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuspendBillService]
    });
  });

  it('should ...', inject([SuspendBillService], (service: SuspendBillService) => {
    expect(service).toBeTruthy();
  }));
});
