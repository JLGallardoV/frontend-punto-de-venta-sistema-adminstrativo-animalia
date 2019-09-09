import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
export interface PeriodicElement {
  position: number;
  name: string;
  apellidoPartenoCliente: string;
  apellidoMartenoCliente: string;
  ciudadCliente: string;
  estadoCliente: string;
  paisCliente: string;
  direccionCliente: string;
  coloniaCliente: string;
  cpCliente: string;
  telefonoCliente: string;
  emailCliente: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Jose', apellidoPartenoCliente: 'Gallardo', apellidoMartenoCliente: 'Vaca', ciudadCliente: 'Abasolo', estadoCliente:'Gto', paisCliente: 'Mexico', direccionCliente: 'primavera 217', coloniaCliente: 'centro', cpCliente: '36970', telefonoCliente:'4291229889', emailCliente:'jlgv@gmail.com'},
  {position: 2, name: 'Luis', apellidoPartenoCliente: 'Galindo', apellidoMartenoCliente: 'Vazquez', ciudadCliente: 'Abasolo', estadoCliente:'Gto', paisCliente: 'Mexico', direccionCliente: 'primavera 117', coloniaCliente: 'centro', cpCliente: '36970', telefonoCliente:'4291229889', emailCliente:'cheche@gmail.com'},
  {position: 3, name: 'Pedro', apellidoPartenoCliente: 'Vaca', apellidoMartenoCliente: 'Duran', ciudadCliente: 'Abasolo', estadoCliente:'Gto', paisCliente: 'Mexico', direccionCliente: 'mina 17', coloniaCliente: 'centro', cpCliente: '36970', telefonoCliente:'4291229889', emailCliente:'tgv@gmail.com'},
  {position: 4, name: 'Ruben', apellidoPartenoCliente: 'Fernandez', apellidoMartenoCliente: 'Figueroa', ciudadCliente: 'Leon', estadoCliente:'Gto', paisCliente: 'Mexico', direccionCliente: 'niebla 202', coloniaCliente: 'centro', cpCliente: '36970', telefonoCliente:'4291229889', emailCliente:'dmpf@gmail.com'},
];

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['position', 'name', 'apellidoPartenoCliente', 'apellidoMartenoCliente','ciudadCliente', 'estadoCliente', 'paisCliente', 'direccionCliente', 'coloniaCliente', 'cpCliente', 'telefonoCliente', 'emailCliente','acciones'];
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
    this._bottomSheet.open(BottomSheetClientes);
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
  selector: 'bottomSheetClientes',
  templateUrl: 'bottomSheetClientes.html',
})
export class BottomSheetClientes {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetClientes>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
