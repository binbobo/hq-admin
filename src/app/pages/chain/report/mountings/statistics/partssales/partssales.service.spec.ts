import { TestBed, inject } from '@angular/core/testing';

import { PartssalesService } from './partssales.service';

describe('PartssalesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartssalesService]
    });
  });

  it('should ...', inject([PartssalesService], (service: PartssalesService) => {
    expect(service).toBeTruthy();
  }));
});
