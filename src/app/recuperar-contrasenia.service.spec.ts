import { TestBed } from '@angular/core/testing';

import { RecuperarContraseniaService } from './recuperar-contrasenia.service';

describe('RecuperarContraseniaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecuperarContraseniaService = TestBed.get(RecuperarContraseniaService);
    expect(service).toBeTruthy();
  });
});
