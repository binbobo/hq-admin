import { TestBed, inject } from '@angular/core/testing';

import { InnerReturnService } from './inner-return.service';

describe('InnerReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InnerReturnService]
    });
  });

  it('should ...', inject([InnerReturnService], (service: InnerReturnService) => {
    expect(service).toBeTruthy();
  }));
});
