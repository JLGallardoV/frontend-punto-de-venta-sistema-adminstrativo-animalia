import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
export interface PeriodicElement {
  position: number;
  idCliente: string;
  idTransaccion: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, idCliente: '1',idTransaccion:'1'},
  {position: 2, idCliente: '2',idTransaccion:'2'},

];

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['position', 'idCliente', 'idTransaccion', 'acciones',];
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
    this._bottomSheet.open(BottomSheetFacturas);
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
  selector: 'bottomSheetFacturas',
  templateUrl: 'bottomSheetFacturas.html',
})
export class BottomSheetFacturas {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetFacturas>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
