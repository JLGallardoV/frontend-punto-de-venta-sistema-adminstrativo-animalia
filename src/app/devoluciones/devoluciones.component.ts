import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IDevoluciones,ITiposDeProblemas,ICompensaciones,IClientes,IProductos,APIService} from '../api.service';


@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {

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

  constructor(private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder,public API:APIService) {
    this.frmDevoluciones = this.formBuilder.group({
      montoConIvaDevolucion:["",Validators.required],
      motivoDevolucion:["",Validators.required],
      idCliente:["",Validators.required],
      idTipoProblema:["",Validators.required],
      idProducto:["",Validators.required],
      idCompensacion:["",Validators.required]
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
  }
  public openBottomSheet(): void {
  this._bottomSheet.open(BottomSheetDevoluciones);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAltaDevolucion(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Devolucion";
  }
  public openAltaTipoProblema(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Problema";
  }
  public openAltaCompensacion(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Compensacion";
  }

  //ABRIR EL MODAL CON LOS DATOS EN LOS INPUTS LISTOS PARA LA MODIFICACION
  public openEditarTipoProblema(content,idTipoProblema: number,tipoProblema:string){
    console.log("id: ",idTipoProblema," nombre: ",tipoProblema);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Problema";
    //pintando los valores en el modal listos para editarlos
    this.frmTiposProblemas.controls['idTipoProblema'].setValue(idTipoProblema); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmTiposProblemas.controls['tipoProblema'].setValue(tipoProblema);
  }
  public openEditarCompensacion(content,idCompensacion: number,tipoCompensacion:string,descripcionCompensacion:string){
    console.log("id: ",idCompensacion," nombre: ",tipoCompensacion);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Compensacion";
    //pintando los valores en el modal listos para editarlos
    this.frmCompensaciones.controls['idCompensacion'].setValue(idCompensacion); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmCompensaciones.controls['tipoCompensacion'].setValue(tipoCompensacion);
    this.frmCompensaciones.controls['descripcionCompensacion'].setValue(descripcionCompensacion);
  }

  //LISTADO DE REGISTROS
  public listarDevoluciones(){
    this.API.mostrarDevoluciones().subscribe(
      (success:any)=>{
        this.dsDevoluciones = new MatTableDataSource(success.respuesta);
        this.dsDevoluciones.paginator = this.paginatorDevoluciones;
      },
      (error)=>{
        console.log("hubo un problema",error)
      }
    );
  }
  public listarTiposProblemas(){
    this.API.mostrarTiposDeProblemas().subscribe(
      (success:any)=>{
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
    let montoConIvaDevolucionForm = this.frmDevoluciones.get('montoConIvaDevolucion').value;
    let motivoDevolucionForm = this.frmDevoluciones.get('motivoDevolucion').value;
    let idClienteForm = this.frmDevoluciones.get('idCliente').value;
    let idTipoProblemaForm = this.frmDevoluciones.get('idTipoProblema').value;
    let idProductoForm = this.frmDevoluciones.get('idProducto').value;
    let idCompensacionForm = this.frmDevoluciones.get('idCompensacion').value;

    this.API.aniadirDevolucion(montoConIvaDevolucionForm,motivoDevolucionForm,idClienteForm,idTipoProblemaForm,idProductoForm,idCompensacionForm).subscribe(
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
    this.API.borrarTipoDeProblema(idCliente).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarTiposProblemas();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
  }
  //ELIMINAR COMPENSACCION
  public eliminarCompensacion(idCliente:number){
    this.API.borrarCompensacion(idCliente).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarCompensaciones();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
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

  ngOnInit() {
    this.listarDevoluciones();
    this.listarTiposProblemas();
    this.listarCompensaciones();
    this.listarProductos();
    this.listarClientes();
  }

}


























@Component({
  selector: 'bottomSheetDevoluciones',
  templateUrl: 'bottomSheetDevoluciones.html',
})
export class BottomSheetDevoluciones {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetDevoluciones>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
