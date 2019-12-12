import { Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { APIService } from '../api.service';
import { IProductos,IClientes,IVendedores } from '../api.service';
import { ITransacciones } from '../api.service';
import { ITiposDePagos } from '../api.service';
import {GenerarPDFsService} from '../generar-pdfs.service';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
@Component({
  selector: 'app-compras',
  templateUrl: '../compras/compras.component.html',
  styleUrls: ['../compras/compras.component.scss']
})
export class FacturasComponent implements OnInit {
  displayedColumns: string[] = ['idTransaccion', 'fechaTransaccion', 'numeroProductosEnTransaccion'];//columnas tabla transacciones
  displayedColumnsProductos: string[] = ['nombreProducto','precioUnitarioProducto','cantidadProducto','descartar'];//columnas tabla transacciones
  public dsTransacciones:MatTableDataSource<ITransacciones>; //datasource para transacciones
  public dsProductos:MatTableDataSource<IProductos>; //dataSource para productos
  public frmVenta: FormGroup;
  public arregloProductosSelect: IProductos[] = [];
  public arregloProductosTabla: IProductos[] = [];
  public arregloClientesSelect: IClientes[] = [];
  public arregloVendedoresSelect: IVendedores[] = [];
  public arregloTiposDePagosSelect: ITiposDePagos[] = [];
  public arregloTiposDePagosLista: ITiposDePagos[] = [];
  public arregloTransacciones:any[] = [];
  public ultimaVenta:any;
  public montoAcumulado : number;
  public usuarioActual:number;

  constructor(public formBuilder: FormBuilder, public API: APIService,public PDF: GenerarPDFsService) {
    this.montoAcumulado = 0;
    this.usuarioActual = 0;
    this.frmVenta = this.formBuilder.group({
          idCliente:["",Validators.required],
          idVendedor:localStorage.getItem("usuario"),
          pagoTransaccion:[""],
          idProducto:["",Validators.required],
          cantidadProducto:["",Validators.required],
          idTipoPago:["",Validators.required]
        });
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
  //llena el input del nombre de usuario, este usuario es el de la sesion
  public mostrarUsuarioEnSesion(){
    this.API.buscarUsuarioPorNombre(localStorage.getItem("usuario")).subscribe(
      (success:any)=>{
          this.usuarioActual = success.respuesta[0].idUsuario;
          //console.log("usuario en sesion: ",this.usuarioActual)
      },
      (error)=>{
        console.log(error)
      }
    );
  }

//agrego los productos del formulario a su tabla de productos
  public transfiereProductos(){
    let transaferirValorID: any;//idProducto
    let transaferirValorCantidad: number = 0;

    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        transaferirValorID = this.frmVenta.get('idProducto').value;
        transaferirValorCantidad = this.frmVenta.get('cantidadProducto').value;
        //sumando monto cada que se agrega un producto
        this.montoAcumulado = this.montoAcumulado + (success.respuesta[0].precioUnitarioProducto * transaferirValorCantidad);

        //verificamos si al querer dar de alta un producto no existe ya en el carrito (tabla de productos)
        if (this.arregloProductosTabla.length >= 1) {
          //console.log("posicion en arreglo: ",this.arregloProductosTabla[0].cantidadProducto);
          for (let i = 0; i < this.arregloProductosTabla.length; i++) {
            if (transaferirValorID.idProducto == this.arregloProductosTabla[i].idProducto) {
              this.arregloProductosTabla[i].cantidadProducto = this.arregloProductosTabla[i].cantidadProducto + transaferirValorCantidad;
              this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
            }else{
              if(i == this.arregloProductosTabla.length -1){
                this.arregloProductosTabla.push({idProducto:transaferirValorID.idProducto,cantidadProducto:transaferirValorCantidad,nombreProducto:transaferirValorID.nombreProducto,precioUnitarioProducto:transaferirValorID.precioUnitarioProducto});
                this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
                break;
              }

            }
          }

        }else{
          this.arregloProductosTabla.push({idProducto:transaferirValorID.idProducto,cantidadProducto:transaferirValorCantidad,nombreProducto:transaferirValorID.nombreProducto,precioUnitarioProducto:transaferirValorID.precioUnitarioProducto});
          this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
          document.getElementById('tablaVentaConcluidaVacia').style.display = "none";
        }
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }

  //eliminar productos de tabla (carrito)
  public eliminarProductosCarrito(objetoProducto:any,indice:number){
    console.log("producto a eliminar: ",indice-1,);
    //console.log(this.arregloProductosTabla)
    this.arregloProductosTabla.splice(indice,1);
    this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro

    //hacemos que la eliminacion de un producto afecte tambien al monto $
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
            this.montoAcumulado = this.montoAcumulado - (success.respuesta[0].precioUnitarioProducto  *  objetoProducto.cantidadProducto);
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
          let tipoPago = this.frmVenta.get('idTipoPago').value;
          this.frmVenta.controls['pagoTransaccion'].setValue(null);
          //si el checkbox esta marcado
          if (tipoPago == true) {
            this.arregloTiposDePagosLista.push({idTipoPago:idTipoPago})
          }else if(tipoPago == false){//elimina los elementos desmarcados
              this.arregloTiposDePagosLista.splice(idTipoPago-1,1)
          }
          //console.log("tipos de pagos ",this.arregloTiposDePagosLista);
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
    idVendedorForm =   this.usuarioActual;
    pagoTransaccionForm = this.frmVenta.get('pagoTransaccion').value;
    arregloProductosForm = this.arregloProductosTabla;
    arregloTiposDePagosForm = this.arregloTiposDePagosLista;

    if (arregloProductosForm.length == 0) {
        alert("no olvides presionar boton de agregar productos \n");
        return;
    }

    console.log("tipo de pago en transaccion: ", arregloTiposDePagosForm);
    this.API.buscarTiposDePagosPorID(arregloTiposDePagosForm[0].idTipoPago).subscribe(
      (success:any)=>{
        if (success.respuesta[0].tipoPago != "efectivo") {
            pagoTransaccionForm = this.montoAcumulado;
            console.log("no pagaste en efectivo")
        }
        this.API.aniadirTransaccion(idClienteForm,idVendedorForm,pagoTransaccionForm,arregloProductosForm,arregloTiposDePagosForm).subscribe(
          (success:any)=>{
            if(success.estatus > 0){
              alert(success.respuesta);
              this.listarUltimaTransaccion();
              document.getElementById('idTicket').style.display = "block";
              this.limpiarFormulario();
            }else if(success.estatus < 0) {
                alert("No cuentas con el dinero suficiente | verifica tu pago");
                console.log("verdadero error: ",success.respuesta)
            }else{
              alert(JSON.stringify(success.respuesta));
            }

          },
          (error)=>{
            alert("algo anda mal | "+ JSON.stringify(error));
          }
        );
      },
      (error:any)=>{

      }
    );
  }

  //muestra la ultima transaccion hecha despues de que se oprime el btn de vender
  public listarUltimaTransaccion(){
      this.API.mostrarUltimaTransaccion().subscribe(
      (success:any)=>{
        let idUltimaTransaccion:number = 0;
        idUltimaTransaccion = success.respuesta[0].idTransaccion;
        this.API.mostrarDetalleTransaccion(idUltimaTransaccion).subscribe(
          (success:any)=>{
            let arregloTemporalProductos:any[] = [];
            let productos: string[] = [];

            for (let i = 0; i < success.respuesta.length; i++) {
              //atrapamos cada uno de los productos en un array
              arregloTemporalProductos.push(success.respuesta[i].nombreProducto);
            }
            productos = arregloTemporalProductos
            //arreglo de objetos listo para iterar
            this.arregloTransacciones = [{
              idTransaccion:success.respuesta[0].idTransaccion,
              nombreCliente:success.respuesta[0].nombreCliente,
              nombreVendedor:success.respuesta[0].nombreVendedor,
              fechaTransaccion:success.respuesta[0].fechaTransaccion,
              productos:productos,
              numeroProductosEnTransaccion:success.respuesta[0].cantidadProductosTransaccion,
              montoConIvaTransaccion:success.respuesta[0].montoConIvaTransaccion,
              ivaTransaccion:success.respuesta[0].ivaTransaccion,
              pagoTransaccion:success.respuesta[0].pagoTransaccion,
              cambioTransaccion:success.respuesta[0].cambioTransaccion,
              tipoPago:success.respuesta[0].tipoPago
            }];
          },
          (error)=>{
            console.log("algo ocurrio: ",error);
          }
        );
      },
      (error)=>{
        console.log("algo ocurrio: ",error);
      }
    );
  }

  //LIMPIO EL FORMULARIO UNA VEZ QUE SE HA REALIZADO UNA COMPRA.
  public limpiarFormulario(){
    this.frmVenta.reset();
    this.frmVenta.controls['idVendedor'].setValue(localStorage.getItem("usuario"));
    this.montoAcumulado = 0;

    this.dsProductos.data=[];
    this.arregloProductosTabla = []
    this.arregloTiposDePagosLista = [];
    document.getElementById('tablaVentaConcluidaVacia').style.display = "block";

  }

  //DENEGAR ACCESO A COMPRAS
  public denegarAccesoCompras(){
    /*deshabilitare el tab de compras en caso de que el vendedor este en sesion
    si el disabled (en el html) detecta true deshabilita el tab*/
    let nivel = localStorage.getItem('nivel');
    if (nivel == 'vendedor') {
        //console.log("acceso denegado: v...");
        return true;
    }else{
        //console.log("acceso permitido: g...")
        return false;
    }
  }
  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }

  ngOnInit() {
    //AppComponent.denegarVistaMenu();
    this.mostrarUsuarioEnSesion();
    this.listarTiposDePagos();
    this.listarProductos();
    this.listarVendedores();
    this.listarClientes();

  }

}
