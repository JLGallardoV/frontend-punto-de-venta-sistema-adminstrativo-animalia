import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { APIService, IUsuarios, IProveedores } from '../api.service';
import { IProductos } from '../api.service';
import { ICompras } from '../api.service';
import { LoginJwtService } from '../login-jwt.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  displayedColumns: string[] = ['idCompra', 'fechaCompra', 'numeroProductosEnCompra'];//columnas tabla transacciones
  displayedColumnsProductos: string[] = ['nombreProducto', 'precioUnitarioProducto', 'cantidadProducto', 'descartar'];//columnas tabla transacciones
  public dsCompras: MatTableDataSource<ICompras>; //datasource para transacciones
  public dsProductos: MatTableDataSource<IProductos>; //dataSource para productos
  public frmCompra: FormGroup;
  public arregloProductosSelect: IProductos[] = [];
  public arregloProductosTabla: IProductos[] = [];
  public arregloUsuariosSelect: IUsuarios[] = [];
  public arregloProveedoresSelect: IProveedores[] = [];
  public arregloCompras: any[] = [];
  public ultimaCompra: any;
  public montoAcumulado: number;
  public usuarioActual: number;
  public privilegios: boolean;
  constructor(public guardian: LoginJwtService, public formBuilder: FormBuilder, public API: APIService) {
    this.montoAcumulado = 0;
    this.usuarioActual = 0;
    this.privilegios = false;
    this.frmCompra = this.formBuilder.group({
      idUsuario: localStorage.getItem("usuario"),
      idProveedor: ["", Validators.required],
      idProducto: ["", Validators.required],
      cantidadProducto: ["", Validators.required],
    });
  }


  /*VALIDAMOS QUE SE PUEDAN INGRESAR UNICAMENTE PUROS NUMEROS EN LOS INPUTS, CORTESIA:
  https://stackblitz.com/edit/numeric-only?file=app%2Fapp.component.html*/
  public soloNumeros(event:any): boolean {
      //atrapamos la tecla ingresada en este if ternario
      const charCode = (event.which) ? event.which : event.keyCode;

      /*si se detecta un caracter especial (en ascii los caracteres especiales son menores a 48)
       o letras (en ascii las letras empiezan apartir del 57), del 31 al 48 en ascii tambien hay caracteres
       especiales, si las anteriores condiciones se cumplen no deja escribir en el input, en su defecto
       si acepta valores*/
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;

    }


  //LLENA SELECT DE PRODUCTOS
  public listarProductos() {
    this.API.mostrarProductos().subscribe(
      (success: any) => {
        return this.arregloProductosSelect = success.respuesta;
      },
      (error) => {
        console.log("algo ocurrio: ", error)
      }
    );
  }


  //LLENA SELECT DE PROVEEDORES
  public listarProveedores() {
    this.API.mostrarProveedores().subscribe(
      (success: any) => {
        return this.arregloProveedoresSelect = success.respuesta;
      },
      (error) => {
        console.log("algo ocurrio: ", error)
      }
    );
  }


  //LLENA EL INPUT DE USUARIO, ESTE ES EL DEL USUARIO EN SESIÓN
  public mostrarUsuarioEnSesion() {
    this.API.buscarUsuarioPorNombre(localStorage.getItem("usuario")).subscribe(
      (success: any) => {
        this.usuarioActual = success.respuesta[0].idUsuario;
        //console.log("usuario en sesion : ", this.usuarioActual)
      },
      (error) => {
        console.log(error)
      }
    );
  }


  //LLENA SELECT DE USUARIOS
  public listarUsuarios() {
    this.API.mostrarUsuarios().subscribe(
      (success: any) => {
        return this.arregloUsuariosSelect = success.respuesta;
      },
      (error) => {
        console.log("algo ocurrio: ", error)
      }
    );
  }

//TRASFIERE LOS PRODUCTOS DEL FORMULARIOS AL CARRITO
  public transfiereProductos() {
    let transaferirValorID: any;
    let transaferirValorCantidad: number = 0;

        this.API.mostrarProductos().subscribe(
          (success:any)=>{
            transaferirValorID = this.frmCompra.get('idProducto').value;
            transaferirValorCantidad = this.frmCompra.get('cantidadProducto').value;
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


  //ELIMINA PRODUCTOS DEL CARRITO
  public eliminarProductosCarrito(objetoProducto: any, indice: number) {
    //console.log("producto a eliminar: ", indice - 1, );
    //console.log(this.arregloProductosTabla)
    this.arregloProductosTabla.splice(indice, 1);
    this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro

    //hacemos que la eliminacion de un producto afecte tambien al monto $
    this.API.mostrarProductos().subscribe(
      (success: any) => {
        this.montoAcumulado = this.montoAcumulado - (success.respuesta[0].precioUnitarioProducto * objetoProducto.cantidadProducto);
      },
      (error) => {
        console.log("algo ocurrio", error)
      }
    );
  }


  //AGREGA UNA COMPRA
  public agregarCompra() {
    //console.log("montoAcumulado")
    let idUsuarioForm: number = 0, idProveedorForm: number = 0, montoCompraForm: number = 0;
    let arregloProductosForm: any[] = []
    idUsuarioForm = this.usuarioActual;
    idProveedorForm = this.frmCompra.get('idProveedor').value;
    montoCompraForm = this.montoAcumulado;
    arregloProductosForm = this.arregloProductosTabla;
    if (arregloProductosForm.length == 0) {
      alert("no olvides presionar boton de agregar productos \n");
    }
    //alert("cte: "+idClienteForm+" vdor: "+idVendedorForm+" pago: "+pagoTransaccionForm+" arrpdtos: "+JSON.stringify(arregloProductosForm)+" arrtipag: "+JSON.stringify(arregloTiposDePagosForm));
    this.API.aniadirCompra(idUsuarioForm, idProveedorForm, montoCompraForm, arregloProductosForm).subscribe(
      (success: any) => {
        if (success.estatus > 0) {
          alert(success.respuesta);
          this.listarUltimaCompra();
          this.limpiarFormulario();
        } else if (success.estatus < 0) {
          alert(JSON.stringify(success.respuesta));
        } else {
          alert(JSON.stringify(success.respuesta));
        }

      },
      (error) => {
        alert("algo anda mal | " + JSON.stringify(error));
      }
    );
  }


  //MUESTRA LA ULTIMA TRANSACCION HECHA DESPUES DE QUE SE HACE UNA COMPRA
  public listarUltimaCompra(){
      this.API.mostrarUltimaCompra().subscribe(
      (success:any)=>{
        //console.log("ultima compra: ",success.respuesta);
        let ultimaCompraRegistro:number = 0;
        ultimaCompraRegistro = success.respuesta[0].idCompra;
        this.API.mostrarDetalleCompra(ultimaCompraRegistro).subscribe(
          (success:any)=>{
            let arregloTemporalProductos:any[] = [];
            let productos: string[] = [];

            for (let i = 0; i < success.respuesta.length; i++) {
              //atrapamos cada uno de los productos en un array
              arregloTemporalProductos.push(success.respuesta[i].nombreProducto);
            }
            productos = arregloTemporalProductos
            //arreglo de objetos listo para iterar
            this.arregloCompras = [{
              idCompra: success.respuesta[0].idCompra,
              montoCompra: success.respuesta[0].montoCompra,
              fechaCompra: success.respuesta[0].fechaCompra,
              nombreProveedor: success.respuesta[0].nombreProveedor,
              nombreUsuario: success.respuesta[0].nombreUsuario,
              productos: productos
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


  //LIMPIAMOS FORMULARIOS CADA VEZ QUE SE CONCLUYE UNA COMPRA
  public limpiarFormulario() {
    this.frmCompra.reset();
    this.frmCompra.controls['idUsuario'].setValue(localStorage.getItem("usuario"));
    this.montoAcumulado = 0;

    this.dsProductos.data = [];
    this.arregloProductosTabla = [];
  }


  ngOnInit() {
    this.mostrarUsuarioEnSesion();
    this.listarProductos();
    this.listarProveedores();
    this.listarUsuarios();
  }

}
