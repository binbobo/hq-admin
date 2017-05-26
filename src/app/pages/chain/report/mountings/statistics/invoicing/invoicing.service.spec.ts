import { TestBed, inject } from '@angular/core/testing';

import { InvoicingService } from './invoicing.service';

describe('InvoicingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoicingService]
    });
  });

  it('should ...', inject([InvoicingService], (service: InvoicingService) => {
    expect(service).toBeTruthy();
  }));
});
