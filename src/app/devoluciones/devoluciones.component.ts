import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

export interface PeriodicElement {
  position: number;
  ivaDevolucion: string;
  montoConIvaDevolucion: string;
  fechaDevolucion: string;
  motivoDevolucion: string;
  nombreCliente: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, ivaDevolucion: '16%', montoConIvaDevolucion: '2399', fechaDevolucion:'12-12-2018',motivoDevolucion:'caducado',nombreCliente:'pedro'},
  {position: 2, ivaDevolucion: '16%', montoConIvaDevolucion: '1399', fechaDevolucion:'12-02-2018',motivoDevolucion:'caducado',nombreCliente:'luis'},
  {position: 3, ivaDevolucion: '16%', montoConIvaDevolucion: '399', fechaDevolucion:'12-10-2018',motivoDevolucion:'caducado',nombreCliente:'rodrigo'},
  {position: 4, ivaDevolucion: '16%', montoConIvaDevolucion: '2430', fechaDevolucion:'12-11-2018',motivoDevolucion:'caducado',nombreCliente:'raul'},
];

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['position','ivaDevolucion','montoConIvaDevolucion','fechaDevolucion','motivoDevolucion','nombreCliente','acciones',];
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
  this._bottomSheet.open(BottomSheetDevoluciones);
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
  selector: 'bottomSheetDevoluciones',
  templateUrl: 'bottomSheetDevoluciones.html',
})
export class BottomSheetDevoluciones {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetDevoluciones>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
