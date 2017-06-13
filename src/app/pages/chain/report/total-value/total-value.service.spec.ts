import { TestBed, inject } from '@angular/core/testing';

import { TotalValueService } from './total-value.service';

describe('TotalValueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TotalValueService]
    });
  });

  it('should be created', inject([TotalValueService], (service: TotalValueService) => {
    expect(service).toBeTruthy();
  }));
});
