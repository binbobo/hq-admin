import { TestBed, inject } from '@angular/core/testing';

import { BillOrderService } from './bill-order.service';

describe('BillOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillOrderService]
    });
  });

  it('should ...', inject([BillOrderService], (service: BillOrderService) => {
    expect(service).toBeTruthy();
  }));
});
