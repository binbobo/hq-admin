import { TestBed, inject } from '@angular/core/testing';

import { PriceCheckService } from './price-check.service';

describe('PriceCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceCheckService]
    });
  });

  it('should ...', inject([PriceCheckService], (service: PriceCheckService) => {
    expect(service).toBeTruthy();
  }));
});
