import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  usuario: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: '18-12-2019', weight: 'edicion registro', usuario: 'juan'},
  {position: 2, name: '18-12-2019', weight: 'revision', usuario: 'juan'},
  {position: 3, name: '18-12-2019', weight: 'edicion registro', usuario: 'juan'},
  {position: 4, name: '18-12-2019', weight: 'revision', usuario: 'juan'},
  {position: 5, name: '18-12-2019', weight: 'revision', usuario: 'juan'},
  {position: 6, name: '18-12-2019', weight: 'revision', usuario: 'juan'},
  {position: 7, name: '18-12-2019', weight: 'edicion registro', usuario: 'rodolfo'},
  {position: 8, name: '18-12-2019', weight: 'edicion registro', usuario: 'rodolfo'},
  {position: 9, name: '18-12-2019', weight: 'revision', usuario: 'ximena'},
  {position: 10, name: '18-12-2019', weight: 'revision', usuario: 'ximena'},
  {position: 11, name: '18-12-2019', weight: 'edicion registro', usuario: 'ximena'},
  {position: 12, name: '18-12-2019', weight: 'edicion registro', usuario: 'ximena'},
  {position: 13, name: '18-12-2019', weight: 'edicion registro', usuario: 'rodolfo'},
  {position: 14, name: '18-12-2019', weight: 'edicion registro', usuario: 'rodolfo'},
  {position: 15, name: '18-12-2019', weight: 'revision', usuario: 'ximena'},
  {position: 16, name: '18-12-2019', weight: 'registro borrado', usuario: 'rodolfo'},
  {position: 17, name: '18-12-2019', weight: 'registro borrado', usuario: 'rodolfo'},
  {position: 18, name: '18-12-2019', weight: 'edicion registro', usuario: 'ximena'},
  {position: 19, name: '18-12-2019', weight: 'registro borrado', usuario: 'ximena'},
  {position: 20, name: '18-12-2019', weight: 'edicion registro', usuario: 'ximena'},
];

@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.scss']
})
export class AccesosComponent implements OnInit {

    public closeResult: string; //modal
    public modal: NgbModalRef; //modal
    public titulo = ""; //para el modal
    public frmProveedores: FormGroup;
    public formValid:Boolean=false;

    displayedColumns: string[] = ['position', 'name', 'weight', 'acciones'];
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
    this._bottomSheet.open(BottomSheetAccesos);
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
    selector: 'bottomSheetAccesos',
    templateUrl: 'bottomSheetAccesos.html',
    })
    export class BottomSheetAccesos {
    constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetAccesos>) {}

    openLink(event: MouseEvent): void {
      this._bottomSheetRef.dismiss();
      event.preventDefault();
    }
    }
