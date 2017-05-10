import { TestBed, inject } from '@angular/core/testing';

import { PurchaseReturnService } from './purchase-return.service';

describe('PurchaseReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseReturnService]
    });
  });

  it('should ...', inject([PurchaseReturnService], (service: PurchaseReturnService) => {
    expect(service).toBeTruthy();
  }));
});
