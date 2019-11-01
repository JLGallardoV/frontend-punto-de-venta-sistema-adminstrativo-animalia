import { Component, OnInit, ViewChild } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { APIService, IUsuarios, IProveedores } from '../api.service';
import { IProductos } from '../api.service';
import { ICompras } from '../api.service';


@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  displayedColumns: string[] = ['idCompra', 'fechaCompra', 'numeroProductosEnCompra'];//columnas tabla transacciones
  displayedColumnsProductos: string[] = ['nombreProducto','precioUnitarioProducto','cantidadProducto'];//columnas tabla transacciones
  public dsCompras:MatTableDataSource<ICompras>; //datasource para transacciones
  public dsProductos:MatTableDataSource<IProductos>; //dataSource para productos
  public frmCompra: FormGroup;
  public arregloProductosSelect: IProductos[] = [];
  public arregloProductosTabla: IProductos[] = [];
  public arregloUsuariosSelect: IUsuarios[] = [];
  public arregloProveedoresSelect: IProveedores[] = [];
  public arregloCompras:ICompras[] = [];
  public ultimaVenta:any;

  constructor(private _bottomSheet: MatBottomSheet, public formBuilder: FormBuilder, public API: APIService) {
    this.frmCompra = this.formBuilder.group({
          idUsuario:["",Validators.required],
          idProveedor:["",Validators.required],
          montoCompra:["",Validators.required],
          idProducto:["",Validators.required],
          cantidadProducto:["",Validators.required],
        });
  }

  //bootsheet (menu emergente de la zona inferior)
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetCompras);
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

  //llena el select de proveedores
  public listarProveedores(){
    this.API.mostrarProveedores().subscribe(
      (success:any)=>{
        return this.arregloProveedoresSelect = success.respuesta;
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  //llena el select de usuarios
  public listarUsuarios(){
    this.API.mostrarUsuarios().subscribe(
      (success:any)=>{
        return this.arregloUsuariosSelect = success.respuesta;
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
        transaferirValorID = this.frmCompra.get('idProducto').value;
        transaferirValorCantidad = this.frmCompra.get('cantidadProducto').value;
        this.arregloProductosTabla.push({idProducto:transaferirValorID,cantidadProducto:transaferirValorCantidad,nombreProducto:success.respuesta[transaferirValorID-1].nombreProducto,precioUnitarioProducto:success.respuesta[transaferirValorID-1].precioUnitarioProducto});
        this.dsProductos = new MatTableDataSource(this.arregloProductosTabla);//paso la info del arreglo al dataSource de la tabla para mostrarlos cada que se agregue un nuevo registro
        console.log("insertar productos: ",this.dsProductos);
      },
      (error)=>{
        console.log("algo ocurrio",error)
      }
    );
  }


  //agregar una compras
  public agregarCompra(){
   let idUsuarioForm:number = 0,idProveedorForm:number = 0,montoCompraForm: number = 0;
    let arregloProductosForm:any[] = []
    idUsuarioForm = this.frmCompra.get('idUsuario').value;
    idProveedorForm = this.frmCompra.get('idProveedor').value;
    montoCompraForm = this.frmCompra.get('montoCompra').value;
    arregloProductosForm = this.arregloProductosTabla;
    if (arregloProductosForm.length == 0) {
        alert("no olvides presionar boton de agregar productos \n");
    }
    //alert("cte: "+idClienteForm+" vdor: "+idVendedorForm+" pago: "+pagoTransaccionForm+" arrpdtos: "+JSON.stringify(arregloProductosForm)+" arrtipag: "+JSON.stringify(arregloTiposDePagosForm));
    this.API.aniadirCompra(idUsuarioForm,idProveedorForm,montoCompraForm,arregloProductosForm).subscribe(
      (success:any)=>{
        if(success.estatus > 0){
          alert(success.respuesta);
          this.listarCompras();
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
  public listarCompras(){
      this.API.mostrarCompras().subscribe(
      (success:any)=>{
        this.arregloCompras = success.respuesta;
        //alert("arreglot: "+JSON.stringify(this.arregloCompras))
        this.ultimaVenta = this.arregloCompras[this.arregloCompras.length - 1]
        //alert("ultima venta: "+JSON.stringify(this.ultimaVenta))
        this.dsCompras = new MatTableDataSource([this.ultimaVenta]); //[prueba] convierto a array la variable prueba para que pueda ser iterada
        this.arregloCompras = [this.ultimaVenta];//aplico simbolo iterador para que pueda iterarlo en un loop
        //alert("arreglo mostrado: "+JSON.stringify(this.arregloTransacciones));
      },
      (error)=>{
        console.log("algo ocurrio: ",error)
      }
    );
  }

  ngOnInit() {
    this.listarProductos();
    this.listarProveedores();
    this.listarUsuarios();
  }

  }
























  //agregando bottomSheet (menu)
  @Component({
  selector: 'bottomSheetCompras',
  templateUrl: 'bottomSheetCompras.html',
  })
  export class BottomSheetCompras {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetCompras>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  }
