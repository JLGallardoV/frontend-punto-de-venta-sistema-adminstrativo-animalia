import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//INTERFACES USADAS AL REDEDOR DE LA APLICACION
export interface ICategorias {
  idCategoria: number;
  nombreCategoria: string;
  subCategoria: string;
  descripcionCategoria: string;
}

export interface ICompras {
  idCompra: number;
  fechaCompra: string;
  cantidadProductos: number;
}

export interface IProductos {
  idProducto: number;
  cantidadProducto: number;
  nombreProducto: string
  precioUnitarioProducto: string
}

export interface IProveedores {
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
export interface IReportesEconomicos {
  montoTransacciones: number;
  montoCompras: number;
  utilidad: number;
}

export interface IRendimientoVendedores {
  nombreVendedor: string;
  vendidos: string;
}
export interface ITransacciones {
  idTransaccion: number;
  fechaTransaccion: string;
  cantidadProductos: number;
}

export interface ITiposDePagos {
  idTipoPago: number;
}
export interface IUsuarios {
  idUsuario: number;
  nombreUsuario: string;
  emailUsuario: string;
  contraseniaUsuario: string;
  idVendedor: number;
  idTipoUsuario: number;
}
export interface IVendedores{
  nombreVendedor:string;
  ciudadVendedor:string;
  estadoVendedor:string;
  direccionVendedor:string;
  telefonoVendedor:string;
  emailVendedor:string;
  fechaNacimientoVendedor:string;
  rfcVendedor:string;
  numeroSeguroSocialVendedor:number;
  antiguedadVendedor:number;
}

export interface IViabilidadProductos {
  nombreProducto: string;
  vendidos: string;
}


@Injectable({
  providedIn: 'root'
})
export class APIService {
  public headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
    'Content-Type': 'application/json',//tipo de contenido JSON
    'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
  });

  constructor(public http: HttpClient) {
  }


  //WS PARA ENTIDAD CATEGORIAS
  public mostrarCategorias() {
    return this.http.get('http://localhost:3000/categoriasWS/listarCategorias', { headers: this.headers });
  }
  public aniadirCategoria(nombreCategoria: string, subCategoria: string, descripcionCategoria: string) {
    return this.http.post('http://localhost:3000/categoriasWS/agregarCategoria', { nombreCategoria, subCategoria, descripcionCategoria }, { headers: this.headers });
  }
  public actualizarCategoria(idCategoria: number, nombreCategoria: string, subCategoria: string, descripcionCategoria: string) {
    return this.http.put(`http://localhost:3000/categoriasWS/actualizarCategoria/${idCategoria}`, { nombreCategoria, subCategoria, descripcionCategoria }, { headers: this.headers });
  }
  public borrarCategoria(idCategoria: number) {
    return this.http.delete(`http://localhost:3000/categoriasWS/eliminarCategoria/${idCategoria}`, { headers: this.headers });
  }

  //WS PARA ENTIDAD CLIENTES
  public mostrarClientes() {
    return this.http.get('http://localhost:3000/clientesWS/listarClientes', { headers: this.headers });
  }
  public aniadirCliente(nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string, contraseniaCliente: string, puntuajeCliente: number, idTipoCliente: number) {
    return this.http.post('http://localhost:3000/clientesWS/agregarCliente', { nombreCliente, apellidoPaternoCliente, apellidoMaternoCliente, ciudadCliente, estadoCliente, paisCliente, direccionCliente, coloniaCliente, cpCliente, telefonoCliente, emailCliente, contraseniaCliente, puntuajeCliente, idTipoCliente }, { headers: this.headers });
  }
  public actualizarCliente(idCliente: number, nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string, contraseniaCliente: string, puntuajeCliente: number, idTipoCliente: number) {
    return this.http.put(`http://localhost:3000/clientesWS/actualizarCliente/${idCliente}`, { nombreCliente, apellidoPaternoCliente, apellidoMaternoCliente, ciudadCliente, estadoCliente, paisCliente, direccionCliente, coloniaCliente, cpCliente, telefonoCliente, emailCliente, contraseniaCliente, puntuajeCliente, idTipoCliente }, { headers: this.headers });
  }
  public borrarCliente(idCliente: number) {
    return this.http.delete(`http://localhost:3000/clientesWS/eliminarCliente/${idCliente}`, { headers: this.headers });
  }

  //WS ENTIDADES COMPRA/VENTAS
  public mostrarCompras() {
    return this.http.get('http://localhost:3000/comprasWS/listarCompras', { headers: this.headers });
  }
  public aniadirCompra(idUsuario: number, idProveedor: number, montoCompra: number, productos: IProductos[]) {
    return this.http.post('http://localhost:3000/comprasWS/agregarCompra', { idUsuario, idProveedor, montoCompra, productos }, { headers: this.headers });
  }
  public aniadirTransaccion(idCliente: number, idVendedor: number, pagoTransaccion: number, productos: IProductos[], tiposDePagos: ITiposDePagos[]) {
    return this.http.post('http://localhost:3000/transaccionesWS/agregarTransaccion', { idCliente, idVendedor, pagoTransaccion, productos, tiposDePagos }, { headers: this.headers });
  }
  public mostrarTransacciones() {
    return this.http.get('http://localhost:3000/transaccionesWS/listarTransacciones', { headers: this.headers });
  }


  //WS PARA PRODUCTOS
  public mostrarProductos() {
    return this.http.get('http://localhost:3000/productosWS/listarProductos', { headers: this.headers });
  }
  public aniadirProducto(nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, stockProducto: number, puntosProducto: number, precioUnitaioProducto: number, idCategoria: number, idAlmacen: number) {
    return this.http.post('http://localhost:3000/productosWS/agregarProducto', { nombreProducto, detalleProducto, contenidoProducto, fechaCaducidadProducto, paisOrigenProducto, stockProducto, puntosProducto, precioUnitaioProducto, idCategoria, idAlmacen }, { headers: this.headers });
  }
  public actualizarProducto(idProducto: number, nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, stockProducto: number, puntosProducto: number, precioUnitaioProducto: number, idCategoria: number, idAlmacen: number) {
    return this.http.put(`http://localhost:3000/productosWS/actualizarProducto/${idProducto}`, { nombreProducto, detalleProducto, contenidoProducto, fechaCaducidadProducto, paisOrigenProducto, stockProducto, puntosProducto, precioUnitaioProducto, idCategoria, idAlmacen }, { headers: this.headers });
  }
  public borrarProducto(idProducto: number) {
    return this.http.delete(`http://localhost:3000/productosWS/eliminarProducto/${idProducto}`, { headers: this.headers });
  }
  public mostrarViabilidadProductos(fechaInicio: string, fechaFinal: string) {
    return this.http.get(`http://localhost:3000/popularidadProductosWS/listarPopularidadProductos/${fechaInicio}/${fechaFinal}`, { headers: this.headers });
  }


  //WS PARA ENTIDAD PROVEEDORES
  public mostrarProveedores() {
    return this.http.get('http://localhost:3000/proveedoresWS/listarProveedores', { headers: this.headers });
  }
  public aniadirProveedor(nombreProveedor: string, ciudadProveedor: string, estadoProveedor: string, paisProveedor: string, direccionProveedor: string, telefonoProveedor: string, emailProveedor: string, descripcionProveedor: string) {
    return this.http.post('http://localhost:3000/proveedoresWS/agregarProveedor', { nombreProveedor, ciudadProveedor, estadoProveedor, paisProveedor, direccionProveedor, telefonoProveedor, emailProveedor, descripcionProveedor }, { headers: this.headers });
  }
  public actualizarProveedor(idProveedor: number, nombreProveedor: string, ciudadProveedor: string, estadoProveedor: string, paisProveedor: string, direccionProveedor: string, telefonoProveedor: string, emailProveedor: string, descripcionProveedor: string) {
    return this.http.put(`http://localhost:3000/proveedoresWS/actualizarProveedor/${idProveedor}`, { nombreProveedor, ciudadProveedor, estadoProveedor, paisProveedor, direccionProveedor, telefonoProveedor, emailProveedor, descripcionProveedor }, { headers: this.headers });
  }
  public borrarProveedor(idProveedor: number) {
    return this.http.delete(`http://localhost:3000/proveedoresWS/eliminarProveedor/${idProveedor}`, { headers: this.headers });
  }

  //WS PARA REPORTES ECONOMICOS
  public mostrarReporte(fechaInicio: string, fechaFinal: string) {
    return this.http.get(`http://localhost:3000/reportesEconomicosWS/listarReportesEconomicos/${fechaInicio}/${fechaFinal}`, { headers: this.headers });
  }

  //WS PARA TIPOS DE PAGOS
  public mostrarTiposDePagos() {
    return this.http.get('http://localhost:3000/tiposPagosWS/listarTiposPagos', { headers: this.headers });
  }
  public aniadirTipoDePago(idTipoPago: number, tipoPago: string, viaTipoPago: string, descripcionTipoPago: string) {
    return this.http.post('http://localhost:3000/tiposPagosWS/agregarTipoPago', { idTipoPago, tipoPago, viaTipoPago, descripcionTipoPago }, { headers: this.headers });
  }
  public actualizarTipoDePago(idTipoPago: number, tipoPago: string, viaTipoPago: string, descripcionTipoPago: string) {
    return this.http.put(`http://localhost:3000/tiposPagosWS/actualizarTipoPago/${idTipoPago}`, { idTipoPago, tipoPago, viaTipoPago, descripcionTipoPago }, { headers: this.headers });
  }
  public borrarTipoDePago(idTipoPago: number) {
    return this.http.delete(`http://localhost:3000/tiposPagosWS/eliminarTipoPago/${idTipoPago}`, { headers: this.headers });
  }


  //WS PARA ENTIDAD USUARIOS
  public mostrarUsuarios() {
    return this.http.get('http://localhost:3000/usuariosWS/listarUsuarios', { headers: this.headers });
  }
  public aniadirUsuario(idUsuario:number,nombreUsuario:string,emailUsuario:string,contraseniaUsuario:string,idVendedor:number,idTipoUsuario:number) {
    return this.http.post('http://localhost:3000/usuariosWS/agregarUsuario', { idUsuario,nombreUsuario,emailUsuario,contraseniaUsuario,idVendedor,idTipoUsuario }, { headers: this.headers });
  }
  public actualizarUsuario(idUsuario:number,nombreUsuario:string,emailUsuario:string,contraseniaUsuario:string,idVendedor:number,idTipoUsuario:number) {
    return this.http.put(`http://localhost:3000/usuariosWS/actualizarUsuario/${idUsuario}`, { idUsuario,nombreUsuario,emailUsuario,contraseniaUsuario,idVendedor,idTipoUsuario}, { headers: this.headers });
  }
  public borrarUsuario(idUsuario: number) {
    return this.http.delete(`http://localhost:3000/usuariosWS/eliminarUsuario/${idUsuario}`, { headers: this.headers });
  }


  //WS PARA ENTIDAD VENDEDORES
  public mostrarVendedores() {
    return this.http.get('http://localhost:3000/vendedoresWS/listarVendedores', { headers: this.headers });
  }
  public aniadirVendedor(nombreVendedor: string, ciudadVendedor: string, estadoVendedor: string, direccionVendedor: string, telefonoVendedor: string, emailVendedor: string, fechaNacimientoVendedor: string, rfcVendedor: string, numeroSeguroSocialVendedor: number, antiguedadVendedor: number) {
    return this.http.post('http://localhost:3000/vendedoresWS/agregarVendedor', { nombreVendedor, ciudadVendedor, estadoVendedor, direccionVendedor, telefonoVendedor, emailVendedor, fechaNacimientoVendedor, rfcVendedor, numeroSeguroSocialVendedor, antiguedadVendedor }, { headers: this.headers });
  }
  public actualizarVendedor(idVendedor: number, nombreVendedor: string, ciudadVendedor: string, estadoVendedor: string, direccionVendedor: string, telefonoVendedor: string, emailVendedor: string, fechaNacimientoVendedor: string, rfcVendedor: string, numeroSeguroSocialVendedor: number, antiguedadVendedor: number) {
    return this.http.put(`http://localhost:3000/vendedoresWS/actualizarVendedor/${idVendedor}`, { nombreVendedor, ciudadVendedor, estadoVendedor, direccionVendedor, telefonoVendedor, emailVendedor, fechaNacimientoVendedor, rfcVendedor, numeroSeguroSocialVendedor, antiguedadVendedor }, { headers: this.headers });
  }
  public borrarVendedor(idVendedor: number) {
    return this.http.delete(`http://localhost:3000/vendedoresWS/eliminarVendedor/${idVendedor}`, { headers: this.headers });
  }
  public mostrarRendimientoVendedores(fechaInicio: string, fechaFinal: string) {
    return this.http.get(`http://localhost:3000/rendimientoVendedoresWS/listarVentasVendedores/${fechaInicio}/${fechaFinal}`, { headers: this.headers });
  }

}
