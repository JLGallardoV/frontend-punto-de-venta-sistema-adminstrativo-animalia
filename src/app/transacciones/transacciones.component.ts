import { Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import {ITransacciones,ICompras,APIService} from '../api.service';
import {LoginJwtService} from '../login-jwt.service';
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
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})


export class TransaccionesComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public arregloDetalleVenta:any[] = []; //para mostrar datos de determinada venta segun el usuario en el modal de informacion
  public arregloDetalleCompra:any[] = []; //para mostrar datos de determinada compra segun el usuario en el modal de informacion
  //propiedades para la tabla
  displayedColumnsTransacciones: string[] = ['idTransaccion','nombreCliente','apellidoPaternoCliente','fechaTransaccion','acciones'];
  displayedColumnsCompras: string[] = ['idCompra','fechaCompra', 'nombreUsuario', 'nombreProveedor','acciones'];
  dsTransacciones : MatTableDataSource<ITransacciones>;
  dsCompras : MatTableDataSource<ICompras>;
  @ViewChild('MatPaginatorCompras',{static: true})paginatorCompras: MatPaginator;
  @ViewChild('MatPaginatorTransacciones', {static: true}) paginatorTransacciones: MatPaginator;

  constructor(
    public guardian:LoginJwtService,
    private modalService: NgbModal,
    public API: APIService,
    public PDF: GenerarPDFsService
  ) {}

  /*
    la primera vez que cargue su componente, el MatPaginator de la pestaña oculta no se renderiza,
    por lo que no está definido y no se puede vincular a la fuente de datos.

  */

  //LISTAR LAS TRANSACCIONES
  public listarTransacciones(){
    this.API.mostrarTransacciones().subscribe(
      (success:any)=>{
        if (success.estatus == 1) {
          document.getElementById('tablaVaciaVentas').style.display = "none";
        }
        this.dsTransacciones = new MatTableDataSource(success.respuesta);
        if(!this.dsTransacciones.paginator){
          this.dsTransacciones.paginator = this.paginatorTransacciones;
          this.dsTransacciones.paginator._intl.itemsPerPageLabel = 'items por pagina';
          this.dsTransacciones.paginator._intl.getRangeLabel = etiquetaRango;

        }
      },
      (error)=>{
        console.log("entro al error directamente")
        console.log(error);
      }
    );
  }

  //LISTAR LAS DETALLE TRANSACCION PARA UNA VENTA EN ESPECIFICO
  public listarDetalleTransaccion(idTransaccion:number){
    this.API.mostrarDetalleTransaccion(idTransaccion).subscribe(
      (success:any)=>{
        let arregloTemporalProductos:any[] = [];
        let productos: string[] = [];

        for (let i = 0; i < success.respuesta.length; i++) {
          //atrapamos cada uno de los productos en un array
          arregloTemporalProductos.push(success.respuesta[i].nombreProducto);
        }
        productos = arregloTemporalProductos
        //arreglo de objetos listo para iterar
        this.arregloDetalleVenta = [{
          idVenta:success.respuesta[0].idTransaccion,
          nombreCliente:success.respuesta[0].nombreCliente,
          productos:productos.join(', \n'),
          monto:success.respuesta[0].montoConIvaTransaccion,
          iva:success.respuesta[0].ivaTransaccion,
          fecha:success.respuesta[0].fechaTransaccion,
          numeroProductosTransaccion:success.respuesta[0].numeroProductosEnTransaccion,
          vendedor:success.respuesta[0].nombreVendedor,
          cliente:success.respuesta[0].nombreCliente,
          tipoPago:success.respuesta[0].tipoPago
        }];

        console.log("contenido arregloDetalleVenta: ",this.arregloDetalleVenta)

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
        if (success.estatus == 1) {
          document.getElementById('tablaVaciaCompras').style.display = "none";
        }
        this.dsCompras = new MatTableDataSource(success.respuesta);
        if(!this.dsCompras.paginator){
          this.dsCompras.paginator = this.paginatorCompras;
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  //LISTAR LAS DETALLE COMPRA
  public listarDetalleCompra(idCompra:number){
    this.API.mostrarDetalleCompra(idCompra).subscribe(
      (success:any)=>{
        let arregloTemporalProductos:any[] = [];
        let productos: string[] = [];

        for (let i = 0; i < success.respuesta.length; i++) {
          //atrapamos cada uno de los productos en un array
          arregloTemporalProductos.push(success.respuesta[i].nombreProducto);
        }
        productos = arregloTemporalProductos
        //arreglo de objetos listo para iterar
        this.arregloDetalleCompra = [{
          idCompra:success.respuesta[0].idCompra,
          monto:success.respuesta[0].montoCompra,
          productos:productos.join(', \n'),
          fecha:success.respuesta[0].fechaCompra,
          numeroProductosCompra:success.respuesta[0].numeroProductosEnCompra,
          nombreUsuario:success.respuesta[0].nombreUsuario,
          nombreProveedor:success.respuesta[0].nombreProveedor
        }];

        console.log("contenido arregloDetalleCompra: ",this.arregloDetalleCompra)
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  //FUNCION PARA ABRIR EL MODAL VENTAS, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContentVentas(longContentVentas:any, idVenta:number) {
    console.log("idTransaccion",idVenta);
    this.modalService.open(longContentVentas, {scrollable: true });
    this.listarDetalleTransaccion(idVenta);
  }

  //FUNCION PARA ABRIR EL MODAL COMPRAS, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContentCompras(longContentCompras:any, idCompra:number) {
    console.log("idTransaccion",idCompra);
    this.modalService.open(longContentCompras, {scrollable: true });
    this.listarDetalleCompra(idCompra);
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
  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }
  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarTransacciones();
    this.listarCompras();
  }

}
