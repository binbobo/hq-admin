import { TestBed, inject } from '@angular/core/testing';

import { ProcurementService } from './procurement.service';

describe('ProcurementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcurementService]
    });
  });

  it('should ...', inject([ProcurementService], (service: ProcurementService) => {
    expect(service).toBeTruthy();
  }));
});
