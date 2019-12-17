import { TestBed } from '@angular/core/testing';

import { ConfirmarEliminarService } from './confirmar-eliminar.service';

describe('ConfirmarEliminarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmarEliminarService = TestBed.get(ConfirmarEliminarService);
    expect(service).toBeTruthy();
  });
});
