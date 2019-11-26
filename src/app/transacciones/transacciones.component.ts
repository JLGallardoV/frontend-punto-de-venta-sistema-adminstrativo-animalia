import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import {ITransacciones,ICompras,APIService} from '../api.service';
import {LoginJwtService} from '../login-jwt.service';

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
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})


export class TransaccionesComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal

  //propiedades para la tabla
  displayedColumnsTransacciones: string[] = ['idTransaccion','montoConIvaTransaccion','cantidadProductosTransaccion','fechaTransaccion','acciones'];
  displayedColumnsCompras: string[] = ['idCompra', 'montoCompra','fechaCompra','acciones'];
  dsTransacciones : MatTableDataSource<ITransacciones>;
  dsCompras : MatTableDataSource<ICompras>;
  @ViewChild('MatPaginatorCompras',{static: true})paginatorCompras: MatPaginator;
  @ViewChild('MatPaginatorTransacciones', {static: true}) paginatorTransacciones: MatPaginator;

  constructor(
    public guardian:LoginJwtService,
    private modalService: NgbModal,
    public API: APIService
  ) {}

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContent(longContent) {
    console.log("aparecer modal");
    this.modalService.open(longContent, { scrollable: true });
  }


  /*
    la primera vez que cargue su componente, el MatPaginator de la pestaña oculta no se renderiza,
    por lo que no está definido y no se puede vincular a la fuente de datos.

  */

  //LISTAR LAS TRANSACCIONES
  public listarTransacciones(){
    this.API.mostrarTransacciones().subscribe(
      (success:any)=>{
        console.log("success: ",success.respuesta)
        this.dsTransacciones = new MatTableDataSource(success.respuesta);
        if(!this.dsTransacciones.paginator){
          this.dsTransacciones.paginator = this.paginatorTransacciones;
          this.dsTransacciones.paginator._intl.itemsPerPageLabel = 'items por pagina';
          this.dsTransacciones.paginator._intl.getRangeLabel = etiquetaRango;

        }
        console.log(this.dsTransacciones);
      },
      (error)=>{
        console.log("entro al error directamente")
        console.log(error);
      }
    );
  }

  //LISTAR LAS DETALLE TRANSACCION
  public listarDetalleTransaccion(idTransaccion:number){
    this.API.mostrarDetalleTransaccion(idTransaccion).subscribe(
      (success:any)=>{
        /*this.dsTransacciones = new MatTableDataSource(success.respuesta);
        if(!this.dsTransacciones.paginator){
          this.dsTransacciones.paginator = this.paginatorTransacciones;

        }
        console.log(this.dsTransacciones);*/
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  //LISTAR COMPRAS
  public listarCompras(){
    this.API.mostrarCompras().subscribe(
      (success:any)=>{
        this.dsCompras = new MatTableDataSource(success.respuesta);
        if(!this.dsCompras.paginator){
          this.dsCompras.paginator = this.paginatorCompras;
        }
        console.log(this.dsCompras);
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  //LISTAR LAS DETALLE COMPRA
  public listarDetalleCompra(idCompra:number){
    this.API.mostrarDetalleTransaccion(idCompra).subscribe(
      (success:any)=>{
        /*this.dsTransacciones = new MatTableDataSource(success.respuesta);
        if(!this.dsTransacciones.paginator){
          this.dsTransacciones.paginator = this.paginatorTransacciones;

        }
        console.log(this.dsTransacciones);*/
      },
      (error)=>{
        console.log(error);
      }
    );
  }


  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsTransacciones.filter = filterValue.trim().toLowerCase();
    this.dsCompras.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsTransacciones.paginator ? this.dsTransacciones.paginator.firstPage(): null;
    //si se usa el modulo tab de compras, entonces arroja los resultados buscados en la primer pagina:
    this.dsCompras.paginator ? this.dsCompras.paginator.firstPage(): null;

  }
  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarTransacciones();
    this.listarCompras();
  }

}
