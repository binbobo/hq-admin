import { TestBed, inject } from '@angular/core/testing';

import { DistributeService } from './distribute.service';

describe('DistributeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistributeService]
    });
  });

  it('should ...', inject([DistributeService], (service: DistributeService) => {
    expect(service).toBeTruthy();
  }));
});
