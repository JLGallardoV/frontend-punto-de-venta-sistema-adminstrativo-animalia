import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export interface ITransacciones {
  idTransaccion: number;
  fechaTransaccion: string;
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
  //mostrar id productos en select - listar tipos de pagos; uso: transacciones (facturas)
  public mostrarProductos(){
    return this.http.get('http://localhost:3000/productosWS/listarProductos',{headers:this.headers});
  }
  //mostrar id productos en select - listar tipos de pagos; uso: transacciones (facturas)
  public mostrarTransacciones(){
    return this.http.get('http://localhost:3000/transaccionesWS/listarTransacciones',{headers:this.headers});
  }
  //agregar una transaccion; uso: transacciones (facturas)
  public aniadirTransaccion(idCliente: number,idVendedor:number,pagoTransaccion:number,arregloProductos:IProductos[],arregloTiposDePagos:ITiposDePagos[]){
    return this.http.post('http://localhost:3000/transaccionesWS/agregarTransaccion',{idCliente,idVendedor,pagoTransaccion,arregloProductos,arregloTiposDePagos},{headers:this.headers});

  }
}
