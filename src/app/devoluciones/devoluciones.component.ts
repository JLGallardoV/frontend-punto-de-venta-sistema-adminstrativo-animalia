import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IDevoluciones,ITiposDeProblemas,ITransacciones,ICompensaciones,IClientes,IProductos,APIService} from '../api.service';
import {LoginJwtService} from '../login-jwt.service';
import {ConfirmarEliminarService} from '../confirmar-eliminar.service';
import {GenerarPDFsService} from '../generar-pdfs.service';

/*ESTA FUNCION UNICAMENTE ES PARA CAMBIAR EL "OF" DEL PAGINADOR A "DE" Y NO SE VEA FEO MEZCLADO EL ESPAÑOL CON INGLES,
ESTAMOS CONFIGURANDO LOS RANGOS DEL PAGINADOR - CORTESÍA: https://stackblitz.com/edit/angular-5mgfxh-6mbpdq */

const etiquetaRango = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { //caso paginador vacio
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);

  const startIndex = page * pageSize; //indice de inicio

/*if resumido; si el indice de inicio excede la logitud de la lista (6 - 5 de 6 por ejemplo) se veria: 6 - 10 de 6 gracias al
[pageSizeOptions] lo cual es incorrecto pues solo hay 6 elementos en tal rango ENTONCES mejor coloca como indice final el indice inicial
quedaria 6 - 6 de 6 que es lo correcto).*/
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}


@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {

  public tablaConDatosDevoluciones: boolean;
  public tablaConDatosProblemas: boolean;
  public tablaConDatosCompensaciones: boolean;
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmDevoluciones: FormGroup;
  public frmTiposProblemas: FormGroup;
  public frmCompensaciones: FormGroup;
  public formValid:Boolean=false;
  public arregloClientesSelect:IClientes[];
  public arregloProductosSelect:IProductos[];
  public arregloTiposProblemasSelect:ITiposDeProblemas[];
  public arregloCompensacionesSelect:ICompensaciones[];
  public arregloTransaccionesSelect:ITransacciones[];
  public arregloDetalleDevolucion:any[] = [];

  //propiedades para tabla
  displayedColumnsDevoluciones: string[] = [
    'idDevolucion',
    'nombreProducto',
    'nombreCliente',
    'tipoProblema',
    'acciones'
  ];
  displayedColumnsTiposProblemas: string[] = [
    'idTipoProblema',
    'tipoProblema',
    'acciones'
  ];
  displayedColumnsCompensaciones: string[] = [
    'idCompensacion',
    'tipoCompensacion',
    'descripcionCompensacion',
    'acciones'
  ];
  dsDevoluciones: MatTableDataSource<IDevoluciones>;
  dsTiposProblemas: MatTableDataSource<ITiposDeProblemas>;
  dsCompensaciones: MatTableDataSource<ICompensaciones>;
  @ViewChild('MatPaginatorDevoluciones',{static: true})paginatorDevoluciones: MatPaginator;
  @ViewChild('MatPaginatorTiposProblemas',{static: true})paginatorTiposProblemas: MatPaginator;
  @ViewChild('MatPaginatorCompensaciones',{static: true})paginatorCompensaciones: MatPaginator;

  constructor(
    public guardian:LoginJwtService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public API:APIService,
    public eliminacionSegura: ConfirmarEliminarService,
    public PDF: GenerarPDFsService

) {
    this.frmDevoluciones = this.formBuilder.group({
      motivoDevolucion:["",Validators.required],
      idCliente:["",Validators.required],
      idTipoProblema:["",Validators.required],
      idProducto:["",Validators.required],
      idCompensacion:["",Validators.required],
      idTransaccion:["",Validators.required]
    });

    this.frmTiposProblemas = this.formBuilder.group({
      idTipoProblema:[""],
      tipoProblema:["",Validators.required]
    });

    this.frmCompensaciones = this.formBuilder.group({
      idCompensacion:[""],
      tipoCompensacion:["",Validators.required],
      descripcionCompensacion:["",Validators.required]
    });
    this.tablaConDatosDevoluciones = false;
    this.tablaConDatosProblemas = false;
    this.tablaConDatosCompensaciones = false;

  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAltaDevolucion(contentDevolucion:any) {
    this.modal= this.modalService.open(contentDevolucion, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Devolución";
  }
  public openAltaTipoProblema(contentProblema:any) {
    this.modal= this.modalService.open(contentProblema, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Problema";
  }
  public openAltaCompensacion(contentCompensacion:any) {
    this.modal= this.modalService.open(contentCompensacion, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Compensación";
  }

  //ABRIR EL MODAL CON LOS DATOS EN LOS INPUTS LISTOS PARA LA MODIFICACION
  public openEditarTipoProblema(contentProblema:any,idTipoProblema: number,tipoProblema:string){
    console.log("id: ",idTipoProblema," nombre: ",tipoProblema);
    this.modal= this.modalService.open(contentProblema, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Problema";
    //pintando los valores en el modal listos para editarlos
    this.frmTiposProblemas.controls['idTipoProblema'].setValue(idTipoProblema); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmTiposProblemas.controls['tipoProblema'].setValue(tipoProblema);
  }
  public openEditarCompensacion(contentCompensacion:any,idCompensacion: number,tipoCompensacion:string,descripcionCompensacion:string){
    console.log("id: ",idCompensacion," nombre: ",tipoCompensacion);
    this.modal= this.modalService.open(contentCompensacion, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Compensacion";
    //pintando los valores en el modal listos para editarlos
    this.frmCompensaciones.controls['idCompensacion'].setValue(idCompensacion); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmCompensaciones.controls['tipoCompensacion'].setValue(tipoCompensacion);
    this.frmCompensaciones.controls['descripcionCompensacion'].setValue(descripcionCompensacion);
  }
  //FUNCION PARA ABRIR EL MODAL DE INFORMACION DEVOLUCIONES, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContentDevoluciones(longContentDevolucion:any, idDevolucion:number) {
    this.modalService.open(longContentDevolucion, {scrollable: true });
    this.listarDetalleDevolucion(idDevolucion);
  }


  //LISTADO DE REGISTROS
  public listarDevoluciones(){
    this.API.mostrarDevoluciones().subscribe(
      (success:any)=>{
        //manipulamos esta variable para dar uso a un ngif que se uso en la vista en un label
        if (success.estatus > 0) {
            this.tablaConDatosDevoluciones = true;
        }
        if (success.estatus == 0){
            this.tablaConDatosDevoluciones = false;
        }
        this.dsDevoluciones = new MatTableDataSource(success.respuesta);
        if(!this.dsDevoluciones.paginator){
          this.dsDevoluciones.paginator = this.paginatorDevoluciones;
          this.dsDevoluciones.paginator._intl.itemsPerPageLabel = 'items por pagina';
          this.dsDevoluciones.paginator._intl.getRangeLabel = etiquetaRango;

        }
      },
      (error)=>{
        console.log("hubo un problema",error)
      }
    );
  }

  //LISTAR DETALLES DEVOLUCION
  public listarDetalleDevolucion(idDevolucion:number){
    this.API.mostrarDetalleDevolucion(idDevolucion).subscribe(
      (success:any)=>{
        this.arregloDetalleDevolucion = success.respuesta;
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  //LISTAR TIPOS DE PROBLEMAS
  public listarTiposProblemas(){
    this.API.mostrarTiposDeProblemas().subscribe(
      (success:any)=>{
        //manipulamos esta variable para dar uso a un ngif que se uso en la vista en un label
        if (success.estatus > 0) {
            this.tablaConDatosProblemas = true;
        }
        if (success.estatus == 0){
            this.tablaConDatosProblemas = false;
        }
        this.dsTiposProblemas = new MatTableDataSource(success.respuesta);
        this.dsTiposProblemas.paginator = this.paginatorTiposProblemas;
        //llenado select
        this.arregloTiposProblemasSelect = success.respuesta;
      },
      (error)=>{
        console.log("hubo un problema",error)
      }
    );
  }
  public listarCompensaciones(){
    this.API.mostrarCompensaciones().subscribe(
      (success:any)=>{
        //manipulamos esta variable para dar uso a un ngif que se uso en la vista en un label
        if (success.estatus > 0) {
            this.tablaConDatosCompensaciones = true;
        }
        if (success.estatus == 0){
            this.tablaConDatosCompensaciones = false;
        }
        this.dsCompensaciones = new MatTableDataSource(success.respuesta);
        this.dsCompensaciones.paginator = this.paginatorCompensaciones;

        //llenado select
        this.arregloCompensacionesSelect = success.respuesta;
      },
      (error)=>{
        console.log("hubo un problema",error)
      }
    );
  }
  //para el select
  public listarClientes(){
    this.API.mostrarClientes().subscribe(
      (success:any)=>{
        return this.arregloClientesSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }
  //para el select
  public listarTransacciones(){
    this.API.mostrarTransacciones().subscribe(
      (success:any)=>{
        return this.arregloTransaccionesSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }
  //llena el select
  public listarProductos(){
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        return this.arregloProductosSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }


  //AGREGAR DEVOLUCION
  public ejecutarPeticionDevolucion(){
    let motivoDevolucionForm = this.frmDevoluciones.get('motivoDevolucion').value;
    let idClienteForm = this.frmDevoluciones.get('idCliente').value;
    let idTipoProblemaForm = this.frmDevoluciones.get('idTipoProblema').value;
    let idProductoForm = this.frmDevoluciones.get('idProducto').value;
    let idCompensacionForm = this.frmDevoluciones.get('idCompensacion').value;
    let idTransaccionForm = this.frmDevoluciones.get('idTransaccion').value;

    this.API.aniadirDevolucion(motivoDevolucionForm,idClienteForm,idTipoProblemaForm,idProductoForm,idCompensacionForm,idTransaccionForm).subscribe(
      (success: any)=>{
        alert(JSON.stringify(success.respuesta));
        this.listarDevoluciones();
        this.frmDevoluciones.reset();
        this.modal.close();

      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //AGREGAR TIPO DE PROBLEMA Y ACTUALIZAR TIPO DE PROBLEMA: EVITO CREAR 2 MODALES
  public ejecutarPeticionTipoProblema(){

    let idTipoProblemaForm = this.frmTiposProblemas.get('idTipoProblema').value;
    let tipoProblemaForm = this.frmTiposProblemas.get('tipoProblema').value;
    console.log("problema",tipoProblemaForm);
    if (this.titulo == "Agregar Problema") {
      this.API.aniadirTipoDeProblema(tipoProblemaForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarTiposProblemas();
          this.frmTiposProblemas.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Problema"){
      this.API.actualizarTipoDeProblema(idTipoProblemaForm,tipoProblemaForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarTiposProblemas();
          this.frmTiposProblemas.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }


  //AGREGAR COMPENSACION Y ACTUALIZAR COMPENSACION: EVITO CREAR 2 MODALES
  public ejecutarPeticionCompensacion(){

    let idCompensacionForm = this.frmCompensaciones.get('idCompensacion').value;
    let tipoCompensacionForm = this.frmCompensaciones.get('tipoCompensacion').value;
    let descripcionCompensacionForm = this.frmCompensaciones.get('descripcionCompensacion').value;

    console.log("compensaciones",tipoCompensacionForm," \n",descripcionCompensacionForm)
    if (this.titulo == "Agregar Compensacion") {
      this.API.aniadirCompensacion(tipoCompensacionForm,descripcionCompensacionForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarCompensaciones();
          this.frmCompensaciones.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Compensacion"){
      this.API.actualizarCompensacion(idCompensacionForm,tipoCompensacionForm,descripcionCompensacionForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarCompensaciones();
          this.frmCompensaciones.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }


  //ELIMINAR TIPO DE PROBLEMA
  public eliminarTipoProblema(idCliente:number){
    let respuesta: boolean = false;
    respuesta = this.eliminacionSegura.confirmarEliminacion();
    if (respuesta == true) {
      this.API.borrarTipoDeProblema(idCliente).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarTiposProblemas();

        },
        (error)=>{
          console.log("hubo un problema: ", error);
        }
      );
    } else {
      console.log("eliminacion cancelada");
    }
  }


  //ELIMINAR COMPENSACCION
  public eliminarCompensacion(idCliente:number){
    let respuesta: boolean = false;
    respuesta = this.eliminacionSegura.confirmarEliminacion();

    if (respuesta == true) {
      this.API.borrarCompensacion(idCliente).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarCompensaciones();

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
    this.dsDevoluciones.filter = filterValue.trim().toLowerCase();
    this.dsTiposProblemas.filter = filterValue.trim().toLowerCase();
    this.dsCompensaciones.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsDevoluciones.paginator ? this.dsDevoluciones.paginator.firstPage(): null;
    //si se usa el modulo tab de compras, entonces arroja los resultados buscados en la primer pagina:
    this.dsTiposProblemas.paginator ? this.dsTiposProblemas.paginator.firstPage(): null;
    //si se usa el modulo tab de compras, entonces arroja los resultados buscados en la primer pagina:
    this.dsCompensaciones.paginator ? this.dsCompensaciones.paginator.firstPage(): null;
  }

  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }
  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarDevoluciones();
    this.listarTiposProblemas();
    this.listarCompensaciones();
    this.listarProductos();
    this.listarClientes();
    this.listarTransacciones();
  }

}
