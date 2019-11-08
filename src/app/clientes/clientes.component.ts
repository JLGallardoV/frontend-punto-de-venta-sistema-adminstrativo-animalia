import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IClientes,APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmClientes: FormGroup;
  public formValid:Boolean=false;
  public arregloTiposDeClientes: any[];
  displayedColumnsClientes: string[] = ['idCliente','nombreCliente', 'apellidoPaternoCliente', 'ciudadCliente', 'estadoCliente','tipoCliente','acciones'];
  dsClientes: MatTableDataSource<IClientes>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder, public API:APIService, public formateandoFecha:DateFormatService) {
    this.arregloTiposDeClientes = [];
    this.frmClientes = this.formBuilder.group({
      idCliente:[""],
      nombreCliente:["",Validators.required],
      apellidoPaternoCliente:["",Validators.required],
      apellidoMaternoCliente:["",Validators.required],
      ciudadCliente:["",Validators.required],
      estadoCliente:["",Validators.required],
      paisCliente:["",Validators.required],
      direccionCliente:["",Validators.required],
      coloniaCliente:["",Validators.required],
      cpCliente:["",Validators.required],
      telefonoCliente:["",Validators.required],
      emailCliente:["",Validators.required],
    //  contraseniaCliente:["",Validators.required],
      puntuajeCliente:["",Validators.required],
      tipoCliente:["",Validators.required],
    });
  }
  //MENU BOTTOMSHEET
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetClientes);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Cliente";
  }//------fin open--------------------------------------------------
  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content,idCliente: number, nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string, puntuajeCliente: number, tipoCliente: number){
    console.log("id: ",idCliente," nombre: ",nombreCliente," ciudad: ",ciudadCliente," tipo: ",tipoCliente);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Cliente";
    //pintando los valores en el modal listos para editarlos
    this.frmClientes.controls['idCliente'].setValue(idCliente); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmClientes.controls['nombreCliente'].setValue(nombreCliente);
    this.frmClientes.controls['apellidoPaternoCliente'].setValue(apellidoPaternoCliente);
    this.frmClientes.controls['apellidoMaternoCliente'].setValue(apellidoMaternoCliente);
    this.frmClientes.controls['ciudadCliente'].setValue(ciudadCliente);
    this.frmClientes.controls['estadoCliente'].setValue(estadoCliente);
    this.frmClientes.controls['paisCliente'].setValue(paisCliente);
    this.frmClientes.controls['direccionCliente'].setValue(direccionCliente);
    this.frmClientes.controls['coloniaCliente'].setValue(coloniaCliente);
    this.frmClientes.controls['cpCliente'].setValue(cpCliente);
    this.frmClientes.controls['telefonoCliente'].setValue(telefonoCliente);
    this.frmClientes.controls['emailCliente'].setValue(emailCliente);
    //this.frmClientes.controls['contraseniaCliente'].setValue(contraseniaCliente);
    this.frmClientes.controls['puntuajeCliente'].setValue(puntuajeCliente);
    //this.frmClientes.controls['tipoCliente'].setValue(tipoCliente);
  }


  //LISTAR CLIENTES
  public listarClientes(){
    this.API.mostrarClientes().subscribe(
      (success:any)=>{
        this.dsClientes = new MatTableDataSource(success.respuesta);
        this.dsClientes.paginator = this.paginator;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //LISTAR TIPOS DE CLIENTES PARA EL SELECT DEL FORMULARIO
  public listarTiposDeClientes(){
    this.API.mostrarTiposDeClientes().subscribe(
      (success: any)=>{
        this.arregloTiposDeClientes = success.respuesta;
        console.log("listando tipos de clientes")
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //AGREGAR CLIENTE Y ACTUALIZAR CLIENTE: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){

    let idClienteForm = this.frmClientes.get('idCliente').value;
    let nombreClienteForm = this.frmClientes.get('nombreCliente').value;
    let apellidoPaternoClienteForm = this.frmClientes.get('apellidoPaternoCliente').value;
    let apellidoMaternoClienteForm = this.frmClientes.get('apellidoMaternoCliente').value;
    let ciudadClienteForm = this.frmClientes.get('ciudadCliente').value;
    let estadoClienteForm = this.frmClientes.get('estadoCliente').value;
    let paisClienteForm = this.frmClientes.get('paisCliente').value;
    let direccionClienteForm = this.frmClientes.get('paisCliente').value;
    let coloniaClienteForm = this.frmClientes.get('coloniaCliente').value;
    let cpClienteForm = this.frmClientes.get('cpCliente').value
    let telefonoClienteForm = this.frmClientes.get('telefonoCliente').value
    let emailClienteForm = this.frmClientes.get('emailCliente').value
    //let contraseniaClienteForm = this.frmClientes.get('contraseniaCliente').value;
    let puntuajeClienteForm = this.frmClientes.get('puntuajeCliente').value;
    let tipoClienteForm = this.frmClientes.get('tipoCliente').value;

    if (this.titulo == "Agregar Cliente") {
      this.API.aniadirCliente(nombreClienteForm,apellidoPaternoClienteForm,apellidoMaternoClienteForm,ciudadClienteForm,estadoClienteForm,paisClienteForm,direccionClienteForm,coloniaClienteForm,cpClienteForm,telefonoClienteForm,emailClienteForm,puntuajeClienteForm,tipoClienteForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarClientes();
          this.frmClientes.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Cliente"){
      this.API.actualizarCliente(idClienteForm,nombreClienteForm,apellidoPaternoClienteForm,apellidoMaternoClienteForm,ciudadClienteForm,estadoClienteForm,paisClienteForm,direccionClienteForm,coloniaClienteForm,cpClienteForm,telefonoClienteForm,emailClienteForm,puntuajeClienteForm,tipoClienteForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarClientes();
          this.frmClientes.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }

  //ELIMINAR CLIENTE
  public eliminarCliente(idCliente:number){
    this.API.borrarCliente(idCliente).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarClientes();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
  }

  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsClientes.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsClientes.paginator ? this.dsClientes.paginator.firstPage(): null;
  }
  ngOnInit() {
    this.listarClientes();
    this.listarTiposDeClientes();
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
