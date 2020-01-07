import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IProveedores,APIService} from '../api.service';
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
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProveedores: FormGroup;
  public formValid:Boolean=false;
  public arregloDetalleProveedor:any[] = [];

  displayedColumnsProveedores: string[] = ['idProveedor', 'nombreProveedor', 'ciudadProveedor', 'estadoProveedor', 'telefonoProveedor','acciones'];
  dsProveedores: MatTableDataSource<IProveedores>;

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
    this.frmProveedores = this.formBuilder.group({
      idProveedor:"",
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

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content:any) {
    this.modal= this.modalService.open(content, {size:'lg'});
    this.titulo = "Agregar Proveedor";
  }

  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content:any,idProveedor: number, nombreProveedor: string, ciudadProveedor: string, estadoProveedor: string, paisProveedor: string, direccionProveedor: string, telefonoProveedor: string, emailProveedor: string, descripcionProveedor: string){
    console.log("id: ",idProveedor," nombre: ",nombreProveedor," ciudad: ",ciudadProveedor," email: ",emailProveedor);
    this.modal= this.modalService.open(content, {size:'lg'});
    this.titulo = "Editar Proveedor";
    //pintando los valores en el modal listos para editarlos
    this.frmProveedores.controls['idProveedor'].setValue(idProveedor); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmProveedores.controls['nombreProveedor'].setValue(nombreProveedor);
    this.frmProveedores.controls['ciudadProveedor'].setValue(ciudadProveedor);
    this.frmProveedores.controls['estadoProveedor'].setValue(estadoProveedor);
    this.frmProveedores.controls['paisProveedor'].setValue(paisProveedor);
    this.frmProveedores.controls['direccionProveedor'].setValue(direccionProveedor);
    this.frmProveedores.controls['telefonoProveedor'].setValue(telefonoProveedor);
    this.frmProveedores.controls['emailProveedor'].setValue(emailProveedor);
    this.frmProveedores.controls['descripcionProveedor'].setValue(descripcionProveedor);
  }

  //MOSTRAR LOS DETALLES DEL PROVEEDOR EN EL MODAL
  public openScrollableContentProveedor(longContentProveedor:any, idProveedor:number) {
    console.log("idTransaccion",idProveedor);
    this.modalService.open(longContentProveedor, {scrollable: true });
    this.listarDetalleProveedor(idProveedor);
  }


  //LISTAR PROVEEDOR
  public listarProveedores(){
    this.API.mostrarProveedores().subscribe(
      (success:any)=>{
        this.dsProveedores = new MatTableDataSource(success.respuesta);
        this.dsProveedores.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "items por pagina";
        this.paginator._intl.getRangeLabel = etiquetaRango;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }
  //LISTAR DETALLES PRODUCTOS
  public listarDetalleProveedor(idProveedor:number){
    this.API.mostrarDetalleProveedor(idProveedor).subscribe(
      (success:any)=>{
        this.arregloDetalleProveedor = success.respuesta;
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  //AGREGAR PROVEEDOR Y ACTUALIZAR PROVEEDOR: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){
    let idProveedorForm = this.frmProveedores.get('idProveedor').value;
    let nombreProveedorForm = this.frmProveedores.get('nombreProveedor').value;
    let ciudadProveedorForm = this.frmProveedores.get('ciudadProveedor').value;
    let estadoProveedorForm = this.frmProveedores.get('estadoProveedor').value;
    let paisProveedorForm = this.frmProveedores.get('paisProveedor').value;
    let direccionProveedorForm = this.frmProveedores.get('direccionProveedor').value;
    let telefonoProveedorForm = this.frmProveedores.get('telefonoProveedor').value;
    let emailProveedorForm = this.frmProveedores.get('emailProveedor').value;
    let descripcionProveedorForm = this.frmProveedores.get('descripcionProveedor').value;

    if (this.titulo == "Agregar Proveedor") {
      this.API.aniadirProveedor(nombreProveedorForm,ciudadProveedorForm,estadoProveedorForm,paisProveedorForm,direccionProveedorForm,telefonoProveedorForm,emailProveedorForm,descripcionProveedorForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarProveedores();
          this.frmProveedores.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Proveedor"){
      this.API.actualizarProveedor(idProveedorForm,nombreProveedorForm,ciudadProveedorForm,estadoProveedorForm,paisProveedorForm,direccionProveedorForm,telefonoProveedorForm,emailProveedorForm,descripcionProveedorForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarProveedores();
          this.frmProveedores.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }

  //ELIMINAR PROVEEDOR
  public eliminarProveedor(idProveedor:number){
    let respuesta: boolean = false;
    respuesta = this.eliminacionSegura.confirmarEliminacion();

    if (respuesta == true) {
      this.API.borrarProveedor(idProveedor).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarProveedores();

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
    this.dsProveedores.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsProveedores.paginator ? this.dsProveedores.paginator.firstPage(): null;
  }


  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }

  ngOnInit() {
    this.listarProveedores();
  }

}
