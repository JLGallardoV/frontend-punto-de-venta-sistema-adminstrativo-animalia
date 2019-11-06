import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ITransacciones, APIService} from '../api.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})
export class TransaccionesComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal

  //propiedades para la tabla
  displayedColumnsTransacciones: string[] = ['idTransaccion', 'nombreProducto', 'montoIvaTransaccion', 'pagoTransaccion', 'cambioTransaccion','fechaTransaccion','numeroProductosEnTransaccion','nombreVendedor','nombreCliente','tipoPago'];
  dsTransacciones : MatTableDataSource<ITransacciones>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public API: APIService
  ) {}

  //PARA EL MENU INFERIOR BOTTOMSHEET
  public openBottomSheet(): void {
  this._bottomSheet.open(BottomSheetTransacciones);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Proveedor";
  }

  //LISTAR LAS TRANSACCIONES
  public listarTransacciones(){
    this.API.mostrarTransacciones().subscribe(
      (success:any)=>{
        this.dsTransacciones = new MatTableDataSource(success.respuesta);
        console.log(this.dsTransacciones);
        this.dsTransacciones.paginator = this.paginator;
      },
      (error)=>{
        console.log(error);

      }
    );
  }

  ngOnInit() {
    this.listarTransacciones();
  }

}





































@Component({
  selector:  'bottomSheetTransacciones',
  templateUrl: 'bottomSheetTransacciones.html',
})
export class BottomSheetTransacciones {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetTransacciones>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
