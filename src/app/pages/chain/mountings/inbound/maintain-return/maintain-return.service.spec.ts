import { TestBed, inject } from '@angular/core/testing';

import { MaintainReturnService } from './maintain-return.service';

describe('MaintainReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintainReturnService]
    });
  });

  it('should ...', inject([MaintainReturnService], (service: MaintainReturnService) => {
    expect(service).toBeTruthy();
  }));
});
