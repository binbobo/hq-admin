import { TestBed, inject } from '@angular/core/testing';

import { AppendOrderService } from './append-order.service';

describe('AppendOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppendOrderService]
    });
  });

  it('should ...', inject([AppendOrderService], (service: AppendOrderService) => {
    expect(service).toBeTruthy();
  }));
});
