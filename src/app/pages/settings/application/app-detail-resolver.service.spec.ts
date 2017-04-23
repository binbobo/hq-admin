import { TestBed, inject } from '@angular/core/testing';

import { AppDetailResolverService } from './app-detail-resolver.service';

describe('AppDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDetailResolverService]
    });
  });

  it('should ...', inject([AppDetailResolverService], (service: AppDetailResolverService) => {
    expect(service).toBeTruthy();
  }));
});
