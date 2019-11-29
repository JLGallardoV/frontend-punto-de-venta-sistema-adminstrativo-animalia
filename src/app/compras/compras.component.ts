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
  constructor(public guardian: LoginJwtService, public formBuilder: FormBuilder, public API: APIService) {
    this.montoAcumulado = 0;
    this.usuarioActual = 0;
    this.frmCompra = this.formBuilder.group({
      idUsuario: localStorage.getItem("usuario"),
      idProveedor: ["", Validators.required],
      idProducto: ["", Validators.required],
      cantidadProducto: ["", Validators.required],
    });
  }

  //llena el select de productos
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

  //llena el select de proveedores
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
  //llena el input del nombre de usuario, este usuario es el de la sesion
  public mostrarUsuarioEnSesion() {
    this.API.buscarUsuarioPorNombre(localStorage.getItem("usuario")).subscribe(
      (success: any) => {
        this.usuarioActual = success.respuesta[0].idUsuario;
        console.log("esta en sesion: ", this.usuarioActual)
      },
      (error) => {
        console.log(error)
      }
    );
  }
  //llena el select de usuarios
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

  public transfiereProductos() {
    let transaferirValorID: number = 0;
    let transaferirValorCantidad: number = 0;

    this.API.mostrarProductos().subscribe(
      (success: any) => {
        transaferirValorID = this.frmCompra.get('idProducto').value;
        transaferirValorCantidad = this.frmCompra.get('cantidadProducto').value;
        //sumando monto cada que se agrega un producto
        this.montoAcumulado = this.montoAcumulado + (success.respuesta[0].precioUnitarioProducto * transaferirValorCantidad);

        //verificamos si al querer dar de alta un producto no existe ya en el carrito (tabla de productos)
        if (this.arregloProductosTabla.length >= 1) {
          console.log("posicion en arreglo: ", this.arregloProductosTabla[0].cantidadProducto);
          for (let i = 0; i < this.arregloProductosTabla.length; i++) {
            if (transaferirValorID == this.arregloProductosTabla[i].idProducto) {
              this.arregloProductosTabla[i].cantidadProducto = this.arregloProductosTabla[i].cantidadProducto + transaferirValorCantidad;
              this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
            } else {
              if (i == this.arregloProductosTabla.length - 1) {
                this.arregloProductosTabla.push({ idProducto: transaferirValorID, cantidadProducto: transaferirValorCantidad, nombreProducto: success.respuesta[transaferirValorID - 1].nombreProducto, precioUnitarioProducto: success.respuesta[transaferirValorID - 1].precioUnitarioProducto });
                this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
                break;
              }
            }
          }

        } else {
          this.arregloProductosTabla.push({ idProducto: transaferirValorID, cantidadProducto: transaferirValorCantidad, nombreProducto: success.respuesta[transaferirValorID - 1].nombreProducto, precioUnitarioProducto: success.respuesta[transaferirValorID - 1].precioUnitarioProducto });
          this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
          document.getElementById('tablaVentaConcluidaVacia').style.display = "none";

        }
      },
      (error) => {
        console.log("algo ocurrio", error)
      }
    );
  }


  //eliminar productos de tabla (carrito)
  public eliminarProductosCarrito(objetoProducto: any, indice: number) {
    console.log("producto a eliminar: ", indice - 1, );
    console.log(this.arregloProductosTabla)
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

  //agregar una compras
  public agregarCompra() {
    console.log("montoAcumulado")
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

  //muestra la ultima transaccion hecha despues de que se oprime el btn de vender
  public listarUltimaCompra(){
      this.API.mostrarUltimaCompra().subscribe(
      (success:any)=>{
        console.log("ultima compra: ",success.respuesta);
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


  //limpiamos el formulario una vez e haya realizado uan venta.
  public limpiarFormulario() {
    this.frmCompra.reset();
    this.frmCompra.controls['idUsuario'].setValue(localStorage.getItem("usuario"));
    this.montoAcumulado = 0;

    this.dsProductos.data = [];
    this.arregloProductosTabla = [];
  }


  ngOnInit() {
    this.guardian.restringirAcceso();
    this.mostrarUsuarioEnSesion();
    this.listarProductos();
    this.listarProveedores();
    this.listarUsuarios();
  }

}
