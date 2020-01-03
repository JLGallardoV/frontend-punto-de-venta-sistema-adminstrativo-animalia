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
  public cambio:number;
  public usuarioActual:number;
  public numeroTiposPagoSeleccionados:number = 0; // variable de control en metodo transfiereTiposDePagos

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
    this.frmVenta.get('pagoTransaccion').disable();
  }


  /*VALIDAMOS QUE SE PUEDAN INGRESAR UNICAMENTE PUROS NUMEROS EN LOS INPUTS, CORTESIA:
  https://stackblitz.com/edit/numeric-only?file=app%2Fapp.component.html*/
  public soloNumeros(event:any): boolean {
      //atrapamos la tecla ingresada en este if ternario la propiedad which contiene el unicode de la tecla presionada

      const charCode = (event.which) ? event.which : event.keyCode;//se usa which o keycode dependiendo el soporte de nuestro browser

      /*si se detecta un caracter especial (en keycode los caracteres especiales son menores a 48)
       o letras (en ascii las letras empiezan apartir del 57), del 31 al 48 en ascii tambien hay caracteres
       especiales, si las anteriores condiciones se cumplen no deja escribir en el input, en su defecto
       si acepta valores*/
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;

    }


  //LLENA EL SELECT DE TIPOS DE PAGOS
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


  //LLENA EL SELECT DE PRODUCTOS
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


  //LLENA EL SELECT DE CLIENTES
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

  //LLENA EL SELECT DE VENDEDORES
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


  //LLENA EL INPUT DEL NOMBRE DE USUARIO, ESTE ES EL DEL USUARIO EN SESIÓN
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


//AGREGO PRODUCTOS DEL FORMULARIO A LA TABLA CARRITO
  public transfiereProductos(){
    let productoSeleccionado: any;//idProducto
    let cantidadSeleccionada: number = 0;

    this.API.mostrarProductos().subscribe(
      (success:any)=>{
        productoSeleccionado = this.frmVenta.get('idProducto').value;
        cantidadSeleccionada = this.frmVenta.get('cantidadProducto').value;

        //si unicamente se selecciona 0, que no mande nada a la tabla
        if (cantidadSeleccionada == 0) {
            return;
        }

        //sumando monto cada que se agrega un producto
        this.montoAcumulado = this.montoAcumulado + (productoSeleccionado.precioUnitarioProducto * cantidadSeleccionada);

        //verificamos si al querer dar de alta un producto no existe ya en el carrito (tabla de productos)
        if (this.arregloProductosTabla.length >= 1) {
          //console.log("posicion en arreglo: ",this.arregloProductosTabla[0].cantidadProducto);
          for (let i = 0; i < this.arregloProductosTabla.length; i++) {
            if (productoSeleccionado.idProducto == this.arregloProductosTabla[i].idProducto) {
              this.arregloProductosTabla[i].cantidadProducto = this.arregloProductosTabla[i].cantidadProducto + cantidadSeleccionada;
              this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
            }else{
              if(i == this.arregloProductosTabla.length -1){
                this.arregloProductosTabla.push({idProducto:productoSeleccionado.idProducto,cantidadProducto:cantidadSeleccionada,nombreProducto:productoSeleccionado.nombreProducto,precioUnitarioProducto:productoSeleccionado.precioUnitarioProducto});
                this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
                break;
              }

            }
          }

        }else{
          this.arregloProductosTabla.push({idProducto:productoSeleccionado.idProducto,cantidadProducto:cantidadSeleccionada,nombreProducto:productoSeleccionado.nombreProducto,precioUnitarioProducto:productoSeleccionado.precioUnitarioProducto});
          this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
          document.getElementById('tablaVentaConcluidaVacia').style.display = "none";
        }
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }


  //ELIMINAR PRODUCTOS DE LA TABLA (CARRITO)
  public eliminarProductosCarrito(objetoProducto:any,indice:number){
    console.log("producto a eliminar: ",indice-1,);
    //console.log(this.arregloProductosTabla)
    this.arregloProductosTabla.splice(indice,1);
    this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro

    //hacemos que la eliminacion de un producto afecte tambien al monto $
    this.API.mostrarProductos().subscribe(
      (success:any)=>{
            this.montoAcumulado = this.montoAcumulado - (objetoProducto.precioUnitarioProducto  *  objetoProducto.cantidadProducto);
            if (this.arregloProductosTabla.length == 0) {
              document.getElementById('tablaVentaConcluidaVacia').style.display = "block";
            }
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }


//ALMACENA LOS TIPOS DE PAGO SELECCIONADOS DEL CHECKBOX EN UN ARREGLO PARA SU USO POSTERIOR
  public transfiereTiposDePagos(idTipoPago:number){
    this.API.mostrarTiposDePagos().subscribe(
      (success:any)=>{
          let tipoPago = this.frmVenta.get('idTipoPago').value;
          this.frmVenta.controls['pagoTransaccion'].setValue(null);
          //si el checkbox esta marcado
          if (tipoPago == true) {
            this.numeroTiposPagoSeleccionados++;
            this.frmVenta.get('pagoTransaccion').enable();
            this.arregloTiposDePagosLista.push({idTipoPago:idTipoPago})
            //tipoPago = false;//prueba
            console.log("tipos de pago seleccionados: ",tipoPago)
          }else if(tipoPago == false){//elimina los elementos desmarcados
              this.numeroTiposPagoSeleccionados--;
              this.arregloTiposDePagosLista.splice(idTipoPago-1,1)
          }
          /*numeroTiposPagoSeleccionados es una variable de control
          para asegurarme que se deshabilite el input de pago si no
          hay checkbox seleccionados*/
          if(this.numeroTiposPagoSeleccionados == 0){
            console.log("ningun tipo de pago seleccionado");
            this.frmVenta.get('pagoTransaccion').disable();
          }
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }


  //AGREGAR UNA TRANSACCION
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
              document.getElementById('idVender').style.pointerEvents = "none";
              document.getElementById('idLimpiarPantallaVentas').style.display = "block";
              this.listarUltimaTransaccion();
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
            setTimeout(()=>{
              this.generarPDF('etiquetaPDF');
              this.cambio = this.arregloTransacciones[0].cambioTransaccion;
              document.getElementById('idCambio').style.display = "contents";
            },0);

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


  //LIMPIO EL FORMULARIO UNA VEZ QUE SE HA REALIZADO UNA VENTA Y SE PRESIONE LA TECLA ESC.
  public limpiarFormularioAtajo(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;//se usa which o keycode dependiendo el soporte de nuestro browser

    if (charCode == 27) {
      this.frmVenta.reset();
      this.frmVenta.controls['idVendedor'].setValue(localStorage.getItem("usuario"));
      this.montoAcumulado = 0;
      this.frmVenta.get('pagoTransaccion').disable();

      this.dsProductos.data=[];
      this.arregloProductosTabla = []
      this.arregloTiposDePagosLista = [];
      document.getElementById('tablaVentaConcluidaVacia').style.display = "block";
      document.getElementById('idCambio').style.display = "none";
      document.getElementById('idVender').style.pointerEvents = "unset";
      document.getElementById('idLimpiarPantallaVentas').style.display = "none";

    }

  }

  //LIMPIO EL FORMULARIO UNA VEZ QUE SE HA REALIZADO UNA VENTA Y SE PRESIONE EL BOTON.
  public limpiarFormulario(){
    this.frmVenta.reset();
    this.frmVenta.controls['idVendedor'].setValue(localStorage.getItem("usuario"));
    this.montoAcumulado = 0;
    this.frmVenta.get('pagoTransaccion').disable();

    this.dsProductos.data=[];
    this.arregloProductosTabla = []
    this.arregloTiposDePagosLista = [];
    document.getElementById('tablaVentaConcluidaVacia').style.display = "block";
    document.getElementById('idCambio').style.display = "none";
    document.getElementById('idVender').style.pointerEvents = "unset";
    document.getElementById('idLimpiarPantallaVentas').style.display = "none";



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
    console.log("este es el parametro de tu pdf: ",etiquetaPDF);
    this.PDF.generarPDF(etiquetaPDF);
    setTimeout(()=>{
      document.getElementById('etiquetaPDF').style.display = "none";
    },3000);

  }

  //EVITO QUE NO SE PUEDA UTLIZAR EL BOTON ATRAS DEL NAVEGADOR Y ME MUESTRE EL MENU,
  //FUENTE: https://es.stackoverflow.com/questions/2092/c%C3%B3mo-detectar-el-evento-o-deshabilitar-el-bot%C3%B3n-atr%C3%A1s-del-navegador-con-angular
  public deshabilitaRetroceso(){
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button" //chrome
    window.onhashchange=function(){window.location.hash="no-back-button";}
  }

  ngOnInit() {
    this.mostrarUsuarioEnSesion();
    this.listarTiposDePagos();
    this.listarProductos();
    this.listarVendedores();
    this.listarClientes();
    this.deshabilitaRetroceso();
  }

}
