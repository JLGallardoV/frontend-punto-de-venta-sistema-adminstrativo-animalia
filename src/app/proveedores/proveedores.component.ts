import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

export interface PeriodicElement {
  position: number;
  nombreProveedor: string;
  ciudadProveedor: string;
  telefonoProveedor: string;
  emailProveedor: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
{position: 1, nombreProveedor: 'Pedigree',ciudadProveedor: 'Leon', telefonoProveedor:'4219918283',emailProveedor:'Pedigree@hotmail.com'},
{position: 2, nombreProveedor: 'DogChow',ciudadProveedor: 'Leon', telefonoProveedor:'4219918283',emailProveedor:'DOGC@hotmail.com'},
{position: 3, nombreProveedor: 'Chop',ciudadProveedor: 'Guadalajara', telefonoProveedor:'4219918283',emailProveedor:'Chop@hotmail.com'},
];

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['position', 'nombreProveedor', 'ciudadProveedor', 'telefonoProveedor','emailProveedor','acciones',];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder) {
    this.frmProveedores = this.formBuilder.group({
      nombreProveedor:["",Validators.required],
      ciudadProveedor:["",Validators.required],
      estadoProveedor:["",Validators.required],
      paisProveedor:["",Validators.required],
      direccionProveedor:["",Validators.required],
      telefonoProveedor:["",Validators.required],
      emailProveedor:["",Validators.required],
      descripcionProveedor:["",Validators.required]
    });
  }
  public openBottomSheet(): void {
  this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Proveedor";
  }//------fin open--------------------------------------------------

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
