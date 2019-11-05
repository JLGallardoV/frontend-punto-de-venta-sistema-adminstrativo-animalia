import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface ITransacciones {
  idTransaccion: number;
  fechaTransaccion: string;
  cantidadProductos: number;
}

export interface ICompras {
  idCompra: number;
  fechaCompra: string;
  cantidadProductos: number;
}

export interface IProductos{
  idProducto: number;
  cantidadProducto: number;
  nombreProducto:string
  precioUnitarioProducto:string
}
export interface ITiposDePagos{
  idTipoPago: number;
}
export interface IUsuarios{
  idUsuario: number;
  nombreUsuario: string;
  emailUsuario: string;
  contraseniaUsuario: string;
  idVendedor: number;
  idTipoUsuario: number;
}
export interface IProveedores{
  idProveedor: number;
  nombreProveedor: string;
  ciudadProveedor: string;
  estadoProveedor: string;
  paisProveedor: string;
  direccionProveedor: string;
  telefonoProveedor: string;
  emailProveedor: string;
  descripcionProveedor: string;
}
export interface IReportesEconomicos{
  montoTransacciones: number;
  montoCompras: number;
  utilidad:number;
}

export interface IViabilidadProductos{
  nombreProducto: string;
  vendidos: string;
}
export interface IRendimientoVendedores{
  nombreVendedor: string;
  vendidos: string;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {
  public headers=new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
    'Content-Type': 'application/json',//tipo de contenido JSON
    'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
  });

  constructor(public http:HttpClient) { }
  //mostrar tipos de pago en checkbox - listar tipos de pagos; uso: transacciones (facturas)
  public mostrarTiposDePagos(){
    return this.http.get('http://localhost:3000/tiposPagosWS/listarTiposPagos',{headers:this.headers});
  }
  //mostrar id productos en select; uso: transacciones (facturas)
  public mostrarProductos(){
    return this.http.get('http://localhost:3000/productosWS/listarProductos',{headers:this.headers});
  }
  //mostrar transaccion en tabla; uso: transacciones (facturas)
  public mostrarTransacciones(){
    return this.http.get('http://localhost:3000/transaccionesWS/listarTransacciones',{headers:this.headers});
  }
  //mostrar compra en tabla; uso: compras
  public mostrarCompras(){
    return this.http.get('http://localhost:3000/comprasWS/listarCompras',{headers:this.headers});
  }

  //mostrar id cliente en select; uso: transacciones (facturas)
  public mostrarClientes(){
    return this.http.get('http://localhost:3000/clientesWS/listarClientes',{headers:this.headers});
  }
  //mostrar id vendedor en select; uso: transacciones (facturas)
  public mostrarVendedores(){
    return this.http.get('http://localhost:3000/vendedoresWS/listarVendedores',{headers:this.headers});
  }
  //mostrar nombre proveedor en select; uso: compras
  public mostrarProveedores(){
    return this.http.get('http://localhost:3000/proveedoresWS/listarProveedores',{headers:this.headers});
  }
  //mostrar id usuario en select; uso: compras
  public mostrarUsuarios(){
    return this.http.get('http://localhost:3000/usuariosWS/listarUsuarios',{headers:this.headers});
  }
  //mostrar registros en tabla; uso: herramientas (tab reportes economicos)
  public mostrarReporte(fechaInicio:string,fechaFinal:string){
    return this.http.get(`http://localhost:3000/reportesEconomicosWS/listarReportesEconomicos/${fechaInicio}/${fechaFinal}`,{headers:this.headers});
  }
  //mostrar registros en tabla; uso: herramientas (tab viabilidad productos)
  public mostrarViabilidadProductos(fechaInicio:string,fechaFinal:string){
    return this.http.get(`http://localhost:3000/popularidadProductosWS/listarPopularidadProductos/${fechaInicio}/${fechaFinal}`,{headers:this.headers});
  }

  //mostrar registros en tabla; uso: herramientas (tab viabilidad productos)
  public mostrarRendimientoVendedores(fechaInicio:string,fechaFinal:string){
    return this.http.get(`http://localhost:3000/rendimientoVendedoresWS/listarVentasVendedores/${fechaInicio}/${fechaFinal}`,{headers:this.headers});
  }

  //mostrar id usuario en select; uso: compras
  public aniadirCompra(idUsuario:number,idProveedor:number,montoCompra:number,productos:IProductos[]){
    return this.http.post('http://localhost:3000/comprasWS/agregarCompra',{idUsuario,idProveedor,montoCompra,productos},{headers:this.headers});
  }
  //agregar una transaccion; uso: transacciones (facturas)
  public aniadirTransaccion(idCliente: number,idVendedor:number,pagoTransaccion:number,productos:IProductos[],tiposDePagos:ITiposDePagos[]){
    return this.http.post('http://localhost:3000/transaccionesWS/agregarTransaccion',{idCliente,idVendedor,pagoTransaccion,productos,tiposDePagos},{headers:this.headers});

  }
}
