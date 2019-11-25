import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {ITransacciones,ICompras,APIService} from '../api.service';
import {LoginJwtService} from '../login-jwt.service';


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
    public formBuilder: FormBuilder,
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
