import { TestBed, inject } from '@angular/core/testing';

import { ClientDetailResolver } from './client-detail-resolver.service';

describe('ClientDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientDetailResolver]
    });
  });

  it('should ...', inject([ClientDetailResolver], (service: ClientDetailResolver) => {
    expect(service).toBeTruthy();
  }));
});
