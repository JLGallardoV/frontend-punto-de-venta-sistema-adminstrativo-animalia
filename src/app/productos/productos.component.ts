import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IProductos,ICategorias,IAlmacenes,APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';
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
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
@Component({
  selector: 'app-categorias',
  templateUrl: '../categorias/categorias.component.html'
//  styleUrls: ['../categorias/categorias.component.scss']
})

export class ProductosComponent implements OnInit {

  public tablaConDatosProductos: boolean;
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProductos: FormGroup;
  public formValid:Boolean=false;
  public arregloCategoria: ICategorias[];
  public arregloAlmacenes: IAlmacenes[];
  public arregloDetalleProducto:any[] = [];
  displayedColumns: string[] = [
  'idProducto',
  'nombreProducto',
  'detalleProducto',
  'stockProducto',
  'precioUnitarioProducto',
  'acciones'
];
  dsProductos:MatTableDataSource<IProductos>;

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
    this.frmProductos = this.formBuilder.group({
      idProducto:[""],
      nombreProducto:["",Validators.required],
      detalleProducto:["",Validators.required],
      contenidoProducto:["",Validators.required],
      fechaCaducidadProducto:[""],
      paisOrigenProducto:["",Validators.required],
      stockProducto:["",Validators.required],
      precioUnitarioProducto:["",Validators.required],
      precioCompraProducto:["",Validators.required],
      idCategoria:["",Validators.required],
      idAlmacen:["",Validators.required]
    });
    this.arregloCategoria = [];
    this.tablaConDatosProductos = false;

  }


  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAltaProducto(contentProducto:any) {
    this.modal= this.modalService.open(contentProducto,{size:'lg'});
    this.titulo = "Agregar Producto";
  }


  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditarProducto(contentProducto:any,idProducto: number, nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, stockProducto:number,precioUnitarioProducto: number, precioCompraProducto: number, idCategoria: number, idAlmacen: number){
    this.modal= this.modalService.open(contentProducto,{size:'lg'});
    this.titulo = "Editar Producto";
    //pintando los valores en el modal listos para editarlos
    this.frmProductos.controls['idProducto'].setValue(idProducto); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmProductos.controls['nombreProducto'].setValue(nombreProducto);
    this.frmProductos.controls['detalleProducto'].setValue(detalleProducto);
    this.frmProductos.controls['contenidoProducto'].setValue(contenidoProducto);

    /*si es un producto que no tiene fecha de caducidad, previamente se le asigno un formato como este; pero para evitar
      que se aplique el disabled al btn de ejecutar del html por el formato incorrecto, entonces asignamos null
      (posteriormente en el click de ejecutar se manda de nuevo el formato 0000-00-00 para que sea aceptado por mi sgbd)*/
    fechaCaducidadProducto == '0000-00-00'? fechaCaducidadProducto = null :null;
    this.frmProductos.controls['fechaCaducidadProducto'].setValue(fechaCaducidadProducto);


    this.frmProductos.controls['paisOrigenProducto'].setValue(paisOrigenProducto);
    this.frmProductos.controls['stockProducto'].setValue(stockProducto);
    this.frmProductos.controls['precioUnitarioProducto'].setValue(precioUnitarioProducto);
    this.frmProductos.controls['precioCompraProducto'].setValue(precioCompraProducto);
    this.frmProductos.controls['idCategoria'].setValue(idCategoria);
    this.frmProductos.controls['idAlmacen'].setValue(idAlmacen);
  }


  //MOSTRAR LOS DETALLES DEL PRODUCTO EN EL MODAL
  public openScrollableContentProductos(longContentProductos:any, idProducto:number) {
    this.modalService.open(longContentProductos, {scrollable: true });
    this.listarDetalleProducto(idProducto);
  }


  //LISTAR DETALLES PRODUCTOS
  public listarDetalleProducto(idProducto:number){
    this.API.mostrarDetalleProducto(idProducto).subscribe(
      (success:any)=>{
        this.arregloDetalleProducto = success.respuesta;
      },
      (error)=>{
        console.log(error);
      }
    );
  }


  //LISTAR PRODUCTOS
  public listarProductos(){
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        //manipulamos esta variable para dar uso a un ngif que se uso en la vista en un label
        if (success.estatus > 0) {
            this.tablaConDatosProductos = true;
        }
        if (success.estatus == 0){
            this.tablaConDatosProductos = false;
        }
        this.dsProductos = new MatTableDataSource(success.respuesta);
        this.dsProductos.paginator = this.paginator;
        this.dsProductos.paginator._intl.itemsPerPageLabel = 'items por pagina';
        this.dsProductos.paginator._intl.getRangeLabel = etiquetaRango;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }


  //LISTAR CATEGORIA PARA EL SELECT DEL FORMULARIO
  public listarCategorias(){
    this.API.mostrarCategorias().subscribe(
      (success: any)=>{
        this.arregloCategoria = success.respuesta;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }


  //LISTAR ALMACEN PARA EL SELECT DEL FORMULARIO
  public listarAlmacenes(){
    this.API.mostrarAlmacenes().subscribe(
      (success: any)=>{
        this.arregloAlmacenes = success.respuesta;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }


  //AGREGAR CLIENTE Y ACTUALIZAR CLIENTE: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){

    let idProductoForm = this.frmProductos.get('idProducto').value;
    let nombreProductoForm = this.frmProductos.get('nombreProducto').value;
    let detalleProductoForm = this.frmProductos.get('detalleProducto').value;
    let contenidoProductoForm = this.frmProductos.get('contenidoProducto').value;
    let fechaCaducidadProductoForm = this.frmProductos.get('fechaCaducidadProducto').value;
    let paisOrigenProductoForm = this.frmProductos.get('paisOrigenProducto').value;
    let stockProductoForm = this.frmProductos.get('stockProducto').value;
    let precioUnitarioProductoForm = this.frmProductos.get('precioUnitarioProducto').value;
    let precioCompraProductoForm = this.frmProductos.get('precioCompraProducto').value;
    let idCategoriaForm = this.frmProductos.get('idCategoria').value;
    let idAlmacenForm = this.frmProductos.get('idAlmacen').value


    /*if reducido para formatear en caso de querer enviar un null en la edicion/alta de fecha (mi sgbd no me acepta null en date)
    quitamos el null y justo al momento de guardar asignamos el siguiente formato*/
    console.log("fecha! ",fechaCaducidadProductoForm)
    if(fechaCaducidadProductoForm == null || fechaCaducidadProductoForm == NaN || fechaCaducidadProductoForm == undefined || fechaCaducidadProductoForm ==""){
      fechaCaducidadProductoForm = '0000-00-00';
    } else{
      fechaCaducidadProductoForm = this.formateandoFecha.formatearFecha(fechaCaducidadProductoForm);//le quito el formato raro que manda el picker para que sea aceptado por mi sgbd
    }
    if (this.titulo == "Agregar Producto") {
      this.API.aniadirProducto(nombreProductoForm, detalleProductoForm, contenidoProductoForm, fechaCaducidadProductoForm, paisOrigenProductoForm, stockProductoForm, precioUnitarioProductoForm, precioCompraProductoForm, idCategoriaForm, idAlmacenForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarProductos();
          this.frmProductos.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Producto"){
      this.API.actualizarProducto(idProductoForm,nombreProductoForm, detalleProductoForm, contenidoProductoForm, fechaCaducidadProductoForm, paisOrigenProductoForm, stockProductoForm,precioUnitarioProductoForm, precioCompraProductoForm, idCategoriaForm, idAlmacenForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarProductos();
          this.frmProductos.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }

  //ELIMINAR PRODUCTO
  public eliminarProducto(idProducto:number){
    let respuesta: boolean = false;

    respuesta = this.eliminacionSegura.confirmarEliminacion();
    if (respuesta == true) {
      this.API.borrarProducto(idProducto).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarProductos();

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
    this.dsProductos.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsProductos.paginator ? this.dsProductos.paginator.firstPage(): null;
  }


  //INVOCANDO SERVICIO PARA GENERAR PDF DE TODA LA VISTA DE LA TABLA
  public generarPDF(etiquetaPDF:string){
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        //REPITE EL PROCESO TANTOS REGISTROS EXISTAN EN EL ARREGLO
        for (let i = 0; i < success.respuesta.length; i++) {
            document.getElementById('botones'+success.respuesta[i].idProducto).style.display = "none"; //esto trabaja concatenando el id de cada registro
            document.getElementById('encabezadoBotones').style.display = "none";
        }
        this.PDF.generarPDF(etiquetaPDF);

        setTimeout(()=>{
          for (let i = 0; i < success.respuesta.length; i++) {
            document.getElementById('botones'+success.respuesta[i].idProducto).style.display = "table-cell";
            document.getElementById('encabezadoBotones').style.display = "table-cell";
          }
        },0);


      },
      (error:any)=>{
        console.log("hubo un error: ",error);
      }
    );
  }


  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPdfParticular(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }


  /*ELIMINA LA LEYENDA DE TABLA VACIA UNA VEZ QUESE DETECTAN DATOS EN LA TABLA
  public removerLeyendaTablaVacia(){
      if (this.dsProductos  != null) {
          console.log("prueba contenido ds");
      }
  }*/


  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarProductos();
    this.listarAlmacenes();
    this.listarCategorias();
  }

}
