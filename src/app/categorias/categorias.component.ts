import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
export interface PeriodicElement {
  position: number;
  name: string;
  weight: string;
  descripcion: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Articulos', weight: 'Arneses', descripcion: 'unicamente perros'},
  {position: 2, name: 'Mascotas', weight: 'Perros', descripcion: 'inexistente mastin tibetano'},
  {position: 3, name: 'Alimentos', weight: 'Alimento Seco', descripcion: 'unicamente perros y gatos'},
  {position: 4, name: 'Juguetes', weight: 'Pelotas', descripcion: 'sin descripcion'}
];

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

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
  this._bottomSheet.open(BottomSheetCategorias);
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
  selector: 'bottomSheetCategorias',
  templateUrl: 'bottomSheetCategorias.html',
  })
  export class BottomSheetCategorias {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetCategorias>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  }
