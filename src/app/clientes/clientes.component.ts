import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IClientes,APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';
import {LoginJwtService} from '../login-jwt.service';
import {ConfirmarEliminarService} from '../confirmar-eliminar.service';
import {GenerarPDFsService} from '../generar-pdfs.service';

const etiquetaRango = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { //caso paginador vacio
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);

  const startIndex = page * pageSize; //indice de inicio

  /*if resumido (terneario); si el indice de inicio excede la logitud de la lista (6 - 5 de 6 por ejemplo) se veria: 6 - 10 de 6 gracias al
  [pageSizeOptions] lo cual es incorrecto pues solo hay 6 elementos en tal rango ENTONCES mejor coloca como indice final el indice inicial
  quedaria 6 - 6 de 6 que es lo correcto).*/
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

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
  public arregloDetalleCliente: any[];
  public tipoCliente:number;
  displayedColumnsClientes: string[] = ['idCliente','nombreCliente', 'apellidoPaternoCliente', 'ciudadCliente', 'estadoCliente','acciones'];
  dsClientes: MatTableDataSource<IClientes>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    public guardian:LoginJwtService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public API:APIService,
    public formateandoFecha:DateFormatService,
    public eliminacionSegura: ConfirmarEliminarService,
    public PDF: GenerarPDFsService

) {
    this.tipoCliente = 3; //representa un cliente ordinario
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
      //contraseniaCliente:["",Validators.required],
    });
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content:any) {
    this.modal= this.modalService.open(content,{size:'lg'});
    this.titulo = "Agregar Cliente";
  }//------fin open--------------------------------------------------
  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content:any,idCliente: number, nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string){
    this.modal= this.modalService.open(content,{size:'lg'});
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
  }
  //FUNCION PARA ABRIR EL MODAL DE INFORMACION CLIENTE, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContentCliente(longContentCliente:any, idCliente:number) {
    this.modalService.open(longContentCliente, {scrollable: true });
    this.listarDetalleCliente(idCliente);
  }


  //LISTAR CLIENTES
  public listarClientes(){
    this.API.mostrarClientes().subscribe(
      (success:any)=>{
        this.dsClientes = new MatTableDataSource(success.respuesta);
        this.dsClientes.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "items por pagina";
        this.paginator._intl.getRangeLabel = etiquetaRango;

      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }
  //LISTAR DETALLES CLIENTES
  public listarDetalleCliente(idCliente:number){
    this.API.mostrarDetalleCliente(idCliente).subscribe(
      (success:any)=>{
        this.arregloDetalleCliente = success.respuesta;
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  /*LISTAR TIPOS DE CLIENTES PARA EL SELECT DEL FORMULARIO: IDEA TIENDA ONLINE
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
  }*/

  //AGREGAR CLIENTE Y ACTUALIZAR CLIENTE: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){

    let idClienteForm = this.frmClientes.get('idCliente').value;
    let nombreClienteForm = this.frmClientes.get('nombreCliente').value;
    let apellidoPaternoClienteForm = this.frmClientes.get('apellidoPaternoCliente').value;
    let apellidoMaternoClienteForm = this.frmClientes.get('apellidoMaternoCliente').value;
    let ciudadClienteForm = this.frmClientes.get('ciudadCliente').value;
    let estadoClienteForm = this.frmClientes.get('estadoCliente').value;
    let paisClienteForm = this.frmClientes.get('paisCliente').value;
    let direccionClienteForm = this.frmClientes.get('direccionCliente').value;
    let coloniaClienteForm = this.frmClientes.get('coloniaCliente').value;
    let cpClienteForm = this.frmClientes.get('cpCliente').value
    let telefonoClienteForm = this.frmClientes.get('telefonoCliente').value
    let emailClienteForm = this.frmClientes.get('emailCliente').value
    //let contraseniaClienteForm = this.frmClientes.get('contraseniaCliente').value;

    if (this.titulo == "Agregar Cliente") {
      this.API.aniadirCliente(nombreClienteForm,apellidoPaternoClienteForm,apellidoMaternoClienteForm,ciudadClienteForm,estadoClienteForm,paisClienteForm,direccionClienteForm,coloniaClienteForm,cpClienteForm,telefonoClienteForm,emailClienteForm,this.tipoCliente).subscribe(
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
      this.API.actualizarCliente(idClienteForm,nombreClienteForm,apellidoPaternoClienteForm,apellidoMaternoClienteForm,ciudadClienteForm,estadoClienteForm,paisClienteForm,direccionClienteForm,coloniaClienteForm,cpClienteForm,telefonoClienteForm,emailClienteForm,this.tipoCliente).subscribe(
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
    let respuesta: boolean = false;
    respuesta = this.eliminacionSegura.confirmarEliminacion();

    if (respuesta == true) {
      this.API.borrarCliente(idCliente).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarClientes();

        },
        (error)=>{
          console.log("hubo un problema: ", error);
        }
      );
    } else {
      console.log("eliminacion cancelada");
    }
  }

  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsClientes.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsClientes.paginator ? this.dsClientes.paginator.firstPage(): null;
  }
  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }

  ngOnInit() {
    this.listarClientes();
  }

}
