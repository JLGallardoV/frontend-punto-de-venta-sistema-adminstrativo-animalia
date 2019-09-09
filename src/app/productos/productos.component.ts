import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
export interface PeriodicElement {
  position: number;
  nombreProducto: string;
  detalleProducto: string;
  contenidoProducto: string;
  stockProducto: string;
  precioUnitarioProducto: string;
  precioMayoreoProducto: string;
  categoria: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, nombreProducto: 'collar castigo', detalleProducto:'granpet', contenidoProducto:'1 pieza',stockProducto:'2',precioUnitarioProducto:'20.00',precioMayoreoProducto:'13.00',categoria:'Articulos'},
  {position: 1, nombreProducto: 'carne de res', detalleProducto:'dogchow', contenidoProducto:'1 lata',stockProducto:'5',precioUnitarioProducto:'20.00',precioMayoreoProducto:'13.00',categoria:'Alimentos'},
];

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['position', 'nombreProducto', 'detalleProducto','contenidoProducto','stockProducto','precioUnitarioProducto','precioMayoreoProducto','categoria','acciones',];
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
    this._bottomSheet.open(BottomSheetProductos);
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
  selector: 'bottomSheetProductos',
  templateUrl: 'bottomSheetProductos.html',
})
export class BottomSheetProductos {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetProductos>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
