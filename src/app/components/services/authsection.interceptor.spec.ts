import { TestBed } from '@angular/core/testing';

import { AuthsectionInterceptor } from './authsection.interceptor';

describe('AuthsectionInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthsectionInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthsectionInterceptor = TestBed.inject(AuthsectionInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
