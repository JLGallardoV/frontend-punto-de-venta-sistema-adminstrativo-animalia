import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IProductos,ICategorias,IAlmacenes,APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';
import {LoginJwtService} from '../login-jwt.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmProductos: FormGroup;
  public formValid:Boolean=false;
  public arregloCategoria: ICategorias[];
  public arregloAlmacenes: IAlmacenes[];

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
  constructor(public guardian:LoginJwtService, private modalService: NgbModal, public formBuilder: FormBuilder,public API:APIService, public formateandoFecha:DateFormatService) {
    this.frmProductos = this.formBuilder.group({
      idProducto:[""],
      nombreProducto:["",Validators.required],
      detalleProducto:["",Validators.required],
      contenidoProducto:["",Validators.required],
      fechaCaducidadProducto:[""],
      paisOrigenProducto:["",Validators.required],
      stockProducto:[""],
      puntosProducto:["",Validators.required],
      precioUnitarioProducto:["",Validators.required],
      precioCompraProducto:["",Validators.required],
      idCategoria:["",Validators.required],
      idAlmacen:["",Validators.required]
    });
  }
  
  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Producto";
  }

  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content,idProducto: number, nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, stockProducto:number, puntosProducto: number, precioUnitarioProducto: number, precioCompraProducto: number, idCategoria: number, idAlmacen: number){
    console.log("id: ",idProducto," nombre: ",nombreProducto," caducidad: ",fechaCaducidadProducto);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
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
    this.frmProductos.controls['puntosProducto'].setValue(puntosProducto);
    this.frmProductos.controls['precioUnitarioProducto'].setValue(precioUnitarioProducto);
    this.frmProductos.controls['precioCompraProducto'].setValue(precioCompraProducto);
    this.frmProductos.controls['idCategoria'].setValue(idCategoria);
    this.frmProductos.controls['idAlmacen'].setValue(idAlmacen);
  }


  //LISTAR CLIENTES
  public listarProductos(){
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        this.dsProductos = new MatTableDataSource(success.respuesta);
        this.dsProductos.paginator = this.paginator;
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
        console.log("listando tipos de clientes")
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
        console.log("listando tipos de clientes")
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
    let puntosProductoForm = this.frmProductos.get('puntosProducto').value;
    let precioUnitarioProductoForm = this.frmProductos.get('precioUnitarioProducto').value;
    let precioCompraProductoForm = this.frmProductos.get('precioCompraProducto').value;
    let idCategoriaForm = this.frmProductos.get('idCategoria').value;
    let idAlmacenForm = this.frmProductos.get('idAlmacen').value

    let fechaCaducidadProductoFormateada = this.formateandoFecha.formatearFecha(fechaCaducidadProductoForm);//le quito el formato raro que manda el picker para que sea aceptado por mi sgbd

    /*if reducido para formatear en caso de querer enviar un null en la edicion/alta de fecha (mi sgbd no me acepta null en date)
    quitamos el null y justo al momento de guardar asignamos el siguiente formato*/
    fechaCaducidadProductoForm == null ? fechaCaducidadProductoForm = '0000-00-00':null;

    if (this.titulo == "Agregar Producto") {
      this.API.aniadirProducto(nombreProductoForm, detalleProductoForm, contenidoProductoForm, fechaCaducidadProductoFormateada, paisOrigenProductoForm, stockProductoForm, puntosProductoForm, precioUnitarioProductoForm, precioCompraProductoForm, idCategoriaForm, idAlmacenForm).subscribe(
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
      this.API.actualizarProducto(idProductoForm,nombreProductoForm, detalleProductoForm, contenidoProductoForm, fechaCaducidadProductoForm, paisOrigenProductoForm, stockProductoForm, puntosProductoForm, precioUnitarioProductoForm, precioCompraProductoForm, idCategoriaForm, idAlmacenForm).subscribe(
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

  //ELIMINAR CLIENTE
  public eliminarProducto(idProducto:number){
    this.API.borrarProducto(idProducto).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarProductos();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
  }

  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsProductos.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsProductos.paginator ? this.dsProductos.paginator.firstPage(): null;
  }
  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarProductos();
    this.listarAlmacenes();
    this.listarCategorias();
  }

}
