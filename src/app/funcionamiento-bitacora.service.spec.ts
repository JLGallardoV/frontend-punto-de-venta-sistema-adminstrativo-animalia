import { TestBed } from '@angular/core/testing';

import { FuncionamientoBitacoraService } from './funcionamiento-bitacora.service';

describe('FuncionamientoBitacoraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FuncionamientoBitacoraService = TestBed.get(FuncionamientoBitacoraService);
    expect(service).toBeTruthy();
  });
});
