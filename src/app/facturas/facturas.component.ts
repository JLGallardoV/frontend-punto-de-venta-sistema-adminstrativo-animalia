import { Component, OnInit, ViewChild } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { APIService } from '../api.service';
import { IProductos } from '../api.service';
import { ITransacciones } from '../api.service';
import { ITiposDePagos } from '../api.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  displayedColumns: string[] = ['idTransaccion', 'fechaTransaccion', 'numeroProductosEnTransaccion'];//columnas tabla transacciones
  displayedColumnsProductos: string[] = ['nombreProducto','precioUnitarioProducto','cantidadProducto'];//columnas tabla transacciones
  public dsTransacciones:MatTableDataSource<ITransacciones>; //datasource para transacciones
  public dsProductos:MatTableDataSource<IProductos>; //dataSource para productos
  public frmVenta: FormGroup;
  public arregloProductosSelect: IProductos[] = [];
  public arregloProductosTabla: IProductos[] = [];
  public arregloClientesSelect: ITiposDePagos[] = [];
  public arregloVendedoresSelect: ITiposDePagos[] = [];
  public arregloTiposDePagosSelect: ITiposDePagos[] = [];
  public arregloTiposDePagosLista: ITiposDePagos[] = [];
  public arregloTransacciones:ITransacciones[] = [];
  public ultimaVenta:any;

  constructor(private _bottomSheet: MatBottomSheet, public formBuilder: FormBuilder, public API: APIService) {
    this.frmVenta = this.formBuilder.group({
          idCliente:["",Validators.required],
          idVendedor:["",Validators.required],
          pagoTransaccion:["",Validators.required],
          idProducto:["",Validators.required],
          cantidadProducto:["",Validators.required],
          idTipoPago:["",Validators.required]
        });
  }

  //bootsheet (menu emergente de la zona inferior)
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetFacturas);
  }

  //llena el select de tipos de pagos
  public listarTiposDePagos(){
    this.API.mostrarTiposDePagos().subscribe(
      (success:any)=>{
        return this.arregloTiposDePagosSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  //llena el select de productos
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

  //llena el select de clientes
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

  //llena el select de vendedores
  public listarVendedores(){
    this.API.mostrarVendedores().subscribe(
      (success:any)=>{
        return this.arregloVendedoresSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  public transfiereProductos(){
    let transaferirValorID: number = 0;
    let transaferirValorCantidad: number = 0;

    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        transaferirValorID = this.frmVenta.get('idProducto').value;
        transaferirValorCantidad = this.frmVenta.get('cantidadProducto').value;
        this.arregloProductosTabla.push({idProducto:transaferirValorID,cantidadProducto:transaferirValorCantidad,nombreProducto:success.respuesta[transaferirValorID-1].nombreProducto,precioUnitarioProducto:success.respuesta[transaferirValorID-1].precioUnitarioProducto});
        this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
        console.log("insertar productos: ",this.dsProductos);
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }

  //almacena los tipos de pago selecionados del checkbox en un arreglo para su posterior uso.
  public transfiereTiposDePagos(idTipoPago:number){
    this.API.mostrarTiposDePagos().subscribe(
      (success:any)=>{
          let prueba = this.frmVenta.get('idTipoPago').value;
          //si el checkbox esta marcado
          if (prueba == true) {
            this.arregloTiposDePagosLista.push({idTipoPago:idTipoPago})
          }else if(prueba == false){//elimina los elementos desmarcados
              this.arregloTiposDePagosLista.splice(idTipoPago-1,1)
          }
          //alert("arreglo final: "+JSON.stringify(this.arregloTiposDePagosLista));
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }
  //agregar una transaccion
  public agregarTransaccion(){
   let idClienteForm:number = 0,idVendedorForm:number = 0,pagoTransaccionForm: number = 0;
    let arregloProductosForm:any[] = [],arregloTiposDePagosForm:any[] = [];
    idClienteForm = this.frmVenta.get('idCliente').value;
    idVendedorForm = this.frmVenta.get('idVendedor').value;
    pagoTransaccionForm = this.frmVenta.get('pagoTransaccion').value;
    arregloProductosForm = this.arregloProductosTabla;
    arregloTiposDePagosForm = this.arregloTiposDePagosLista;
    if (arregloProductosForm.length == 0) {
        alert("no olvides presionar boton de agregar productos \n");
    }
    //alert("cte: "+idClienteForm+" vdor: "+idVendedorForm+" pago: "+pagoTransaccionForm+" arrpdtos: "+JSON.stringify(arregloProductosForm)+" arrtipag: "+JSON.stringify(arregloTiposDePagosForm));
    this.API.aniadirTransaccion(idClienteForm,idVendedorForm,pagoTransaccionForm,arregloProductosForm,arregloTiposDePagosForm).subscribe(
      (success:any)=>{
        if(success.estatus > 0){
          alert(success.respuesta);
          this.listarTransacciones();
        }else if(success.estatus < 0) {
            alert("No cuentas con el dinero suficiente | verifica tu pago");
        }else{
          alert(JSON.stringify(success.respuesta));
        }

      },
      (error)=>{
        alert("algo anda mal | "+ JSON.stringify(error));
      }
    );
  }

  //muestra la transaccion hecha despues de que se oprime el btn de vender
  public listarTransacciones(){
      this.API.mostrarTransacciones().subscribe(
      (success:any)=>{
        this.arregloTransacciones = success.respuesta;
        alert("arreglot: "+JSON.stringify(this.arregloTransacciones))
        this.ultimaVenta = this.arregloTransacciones[this.arregloTransacciones.length - 1]
        alert("ultima venta: "+JSON.stringify(this.ultimaVenta))
        this.dsTransacciones = new MatTableDataSource([this.ultimaVenta]); //[prueba] convierto a array la variable prueba para que pueda ser iterada
        this.arregloTransacciones = [this.ultimaVenta];//aplico simbolo iterador para que pueda iterarlo en un loop
        //alert("arreglo mostrado: "+JSON.stringify(this.arregloTransacciones));
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  ngOnInit() {
    this.listarTiposDePagos();
    this.listarProductos();
    this.listarVendedores();
    this.listarClientes();
  }

}
























//agregando bottomSheet (menu)
@Component({
  selector: 'bottomSheetFacturas',
  templateUrl: 'bottomSheetFacturas.html',
})
export class BottomSheetFacturas {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetFacturas>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
