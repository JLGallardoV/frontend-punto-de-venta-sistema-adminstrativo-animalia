import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ICategorias,APIService} from '../api.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo:string; //para el modal
  public frmCategorias: FormGroup;
  public formValid:Boolean=false;
  //propiedades para tabla y paginador de la misma
  displayedColumnsCategorias: string[] = ['idCategoria', 'nombreCategoria', 'subCategoria', 'descripcionCategoria','acciones'];
  dsCategorias: MatTableDataSource<ICategorias>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder, public API:APIService) {
    this.titulo = "";
    this.frmCategorias = this.formBuilder.group({
      idCategoria:[""],
      nombreCategoria:["",Validators.required],
      subCategoria:["",Validators.required],
      descripcionCategoria:["",Validators.required]
    });
  }

  //MENU BOTTOMSHEET
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetCategorias);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Categoria";
  }

  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content,idCategoria:number,nombreCategoria:string,subCategoria:string,descripcionCategoria:string){
    console.log("id: ",idCategoria," nombreCategoria: ",nombreCategoria," subcategorias: ",subCategoria," descripcion: ",descripcionCategoria);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Categoria";
    //pintando los valores en el modal listos para editarlos
    this.frmCategorias.controls['idCategoria'].setValue(idCategoria); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmCategorias.controls['nombreCategoria'].setValue(nombreCategoria);
    this.frmCategorias.controls['subCategoria'].setValue(subCategoria);
    this.frmCategorias.controls['descripcionCategoria'].setValue(descripcionCategoria);
  }

  //LISTAR CATEGORIAS
  public listarCategorias(){
    this.API.mostrarCategorias().subscribe(
      (success:any)=>{
        this.dsCategorias = new MatTableDataSource(success.respuesta);
        this.dsCategorias.paginator = this.paginator;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //AGREGAR CATEGORIA Y ACTUALIZAR CATEGORIA: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){
    let idCategoriaForm = this.frmCategorias.get('idCategoria').value;
    let nombreCategoriaForm = this.frmCategorias.get('nombreCategoria').value;
    let subCategoriaForm = this.frmCategorias.get('subCategoria').value;
    let descripcionCategoriaForm = this.frmCategorias.get('descripcionCategoria').value;

    if (this.titulo == "Agregar Categoria") {
      this.API.aniadirCategoria(nombreCategoriaForm,subCategoriaForm,descripcionCategoriaForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarCategorias();
          this.frmCategorias.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Categoria"){
      this.API.actualizarCategoria(idCategoriaForm,nombreCategoriaForm,subCategoriaForm,descripcionCategoriaForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarCategorias();
          this.frmCategorias.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }


  //ELIMINAR CATEGORIA
  public eliminarCategoria(idCategoria:number){
    this.API.borrarCategoria(idCategoria).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarCategorias();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
  }
  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsCategorias.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsCategorias.paginator ? this.dsCategorias.paginator.firstPage(): null;
  }

  ngOnInit() {
    this.listarCategorias();
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
