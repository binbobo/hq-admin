import { TestBed, inject } from '@angular/core/testing';

import { TakeStockService } from './take-stock.service';

describe('TakeStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TakeStockService]
    });
  });

  it('should ...', inject([TakeStockService], (service: TakeStockService) => {
    expect(service).toBeTruthy();
  }));
});
