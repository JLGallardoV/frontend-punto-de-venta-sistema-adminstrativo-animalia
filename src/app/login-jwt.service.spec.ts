import { TestBed } from '@angular/core/testing';

import { LoginJwtService } from './login-jwt.service';

describe('LoginJwtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginJwtService = TestBed.get(LoginJwtService);
    expect(service).toBeTruthy();
  });
});
