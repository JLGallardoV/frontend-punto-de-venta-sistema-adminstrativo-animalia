import { TestBed } from '@angular/core/testing';

import { GenerarPDFsService } from './generar-pdfs.service';

describe('GenerarPDFsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerarPDFsService = TestBed.get(GenerarPDFsService);
    expect(service).toBeTruthy();
  });
});
