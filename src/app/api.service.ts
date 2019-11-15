import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//INTERFACES USADAS AL REDEDOR DE LA APLICACION
export interface IAccesos{
  idAcceso:number;
  fechaAcceso:string;
  accionAcceso:string;
  nombreUsuario:string;
}

export interface IAlmacenes {
  idAlmacen: number;
  ciudadAlmacen: string;
  estadoAlmacen: string;
  direccionAlmacen: string;
  referenciaAlmacen: string;
  telefonoAlmacen: string;
}

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

export interface ICompensaciones{
  idCompensacion: number;
  tipoCompensacion: string;
  descripcionCompensacion: string;
}

export interface IClientes {
  idCliente: number;
  nombreCliente: string;
  apellidoPartenoCliente: string;
  apellidoMartenoCliente: string;
  ciudadCliente: string;
  estadoCliente: string;
  paisCliente: string;
  direccionCliente: string;
  coloniaCliente: string;
  cpCliente: number;
  telefonoCliente: string;
  emailCliente: string;
  puntuajeCliente: number;
  idTipoCliente:number;
}

export interface IDevoluciones{
  idDevolucion: number;
  nombreProducto: string;
  montoConIvaDevolucion: number;
  fechaDevolucion: string;
  motivoDevolucion: string;
  nombreCliente: string;
  tipoProblema: string;
  tipoCompensacion: string;
}

export interface IEnvios{
  ciudadEnvio: string;
  estadoEnvio: string;
  paisEnvio: string;
  observacionesEnvio: string;
  idTransaccion: number;
  idMedioEntrega: number;
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


export interface ITiposDeProblemas{
  idTipoProblema:number;
  tipoProblema: string;
}

export interface ITiposDePagos {
  idTipoPago: number;
}

export interface ITiposDeUsuarios {
  idTipoUsuario: number;
  tipoUsuario: string;
  descripcionTipoUsuario: string;
}

export interface ITransacciones {
  idTransaccion: number;
  fechaTransaccion: string;
  cantidadProductos: number;
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


  //WS PARA ENTIDAD ACCESOS
  public mostrarAccesos() {
    return this.http.get('http://localhost:3000/accesosWS/listarAccesos', { headers: this.headers });
  }
  public aniadirAcceso(accionAcceso:string,idUsuario:number) {
    return this.http.post('http://localhost:3000/accesosWS/agregarAcceso', { accionAcceso,idUsuario}, { headers: this.headers });
  }

  //WS PARA ENTIDAD BITACORA ACCESOS
  public mostrarAlmacenes() {
    return this.http.get('http://localhost:3000/almacenesWS/listarAlmacenes', { headers: this.headers });
  }
  public aniadirAlmacen(idAlmacen: number,estadoAlmacen:string,paisAlmacen:string,direccionAlmacen:string,referenciaAlmacen:string,telefonoAlmacen:string) {
    return this.http.post('http://localhost:3000/almacenesWS/agregarAlmacen', { idAlmacen,estadoAlmacen,paisAlmacen,direccionAlmacen,referenciaAlmacen,telefonoAlmacen }, { headers: this.headers });
  }
  public actualizarAlmacen(idAlmacen: number,estadoAlmacen:string,paisAlmacen:string,direccionAlmacen:string,referenciaAlmacen:string,telefonoAlmacen:string) {
    return this.http.put(`http://localhost:3000/almacenesWS/actualizarAlmacen/${idAlmacen}`, {idAlmacen,estadoAlmacen,paisAlmacen,direccionAlmacen,referenciaAlmacen,telefonoAlmacen}, { headers: this.headers });
  }
  public borrarAlmacen(idAlmacen: number) {
    return this.http.delete(`http://localhost:3000/almacenesWS/eliminarAlmacen/${idAlmacen}`, { headers: this.headers });
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
  public aniadirCliente(nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string, puntuajeCliente: number, idTipoCliente: number) {
    return this.http.post('http://localhost:3000/clientesWS/agregarCliente', { nombreCliente, apellidoPaternoCliente, apellidoMaternoCliente, ciudadCliente, estadoCliente, paisCliente, direccionCliente, coloniaCliente, cpCliente, telefonoCliente, emailCliente,  puntuajeCliente, idTipoCliente }, { headers: this.headers });
  }
  public actualizarCliente(idCliente: number, nombreCliente: string, apellidoPaternoCliente: string, apellidoMaternoCliente: string, ciudadCliente: string, estadoCliente: string, paisCliente: string, direccionCliente: string, coloniaCliente: string, cpCliente: number, telefonoCliente: string, emailCliente: string, puntuajeCliente: number, idTipoCliente: number) {
    return this.http.put(`http://localhost:3000/clientesWS/actualizarCliente/${idCliente}`, { nombreCliente, apellidoPaternoCliente, apellidoMaternoCliente, ciudadCliente, estadoCliente, paisCliente, direccionCliente, coloniaCliente, cpCliente, telefonoCliente, emailCliente, puntuajeCliente, idTipoCliente }, { headers: this.headers });
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
    console.log("en el servicio: ",pagoTransaccion,"\n", productos,"\n", tiposDePagos )
    return this.http.post('http://localhost:3000/transaccionesWS/agregarTransaccion', { idCliente, idVendedor, pagoTransaccion, productos, tiposDePagos }, { headers: this.headers });
  }
  public mostrarTransacciones() {
    return this.http.get('http://localhost:3000/transaccionesWS/listarTransacciones', { headers: this.headers });
  }

  //WS PARA ENTIDAD COMPENSACIONES
  public mostrarCompensaciones() {
    return this.http.get('http://localhost:3000/compensacionesWS/listarCompensaciones', { headers: this.headers });
  }
  public aniadirCompensacion(tipoCompensacion:string,descripcionCompensacion:string) {
    return this.http.post('http://localhost:3000/compensacionesWS/agregarCompensacion', { tipoCompensacion,descripcionCompensacion}, { headers: this.headers });
  }
  public actualizarCompensacion(idCompensacion: number,tipoCompensacion:string,descripcionCompensacion:string) {
    return this.http.put(`http://localhost:3000/compensacionesWS/actualizarCompensacion/${idCompensacion}`, { tipoCompensacion,descripcionCompensacion }, { headers: this.headers });
  }
  public borrarCompensacion(idCompensacion: number) {
    return this.http.delete(`http://localhost:3000/compensacionesWS/eliminarCompensacion/${idCompensacion}`, { headers: this.headers });
  }

  //WS ENTIDAD DEVOLUCION
  public mostrarDevoluciones() {
    return this.http.get('http://localhost:3000/devolucionesWS/listarDevoluciones', { headers: this.headers });
  }
  public aniadirDevolucion(montoConIvaDevolucion:number,motivoDevolucion:string,idCliente:number,idTipoProblema:number,idProducto:number,idCompensacion:number) {
    return this.http.post('http://localhost:3000/devolucionesWS/agregarDevolucion', {montoConIvaDevolucion,motivoDevolucion,idCliente,idTipoProblema,idProducto,idCompensacion}, { headers: this.headers });
  }

  //WS ENTIDAD ENVIO
  public mostrarEnvios() {
    return this.http.get('http://localhost:3000/enviosWS/listarEnvios', { headers: this.headers });
  }
  public aniadirEnvio(ciudadEnvio: string,estadoEnvio: string,paisEnvio: string,observacionesEnvio: string,idTransaccion: number,idMedioEntrega: number) {
    return this.http.post('http://localhost:3000/enviosWS/agregarEnvio', {ciudadEnvio,estadoEnvio,paisEnvio,observacionesEnvio,idTransaccion,idMedioEntrega}, { headers: this.headers });
  }
  public borrarEnvio(idEnvio:number) {
    return this.http.delete(`http://localhost:3000/enviosWS/agregarEnvio/${idEnvio}`, { headers: this.headers });
  }


  //WS PARA PRODUCTOS
  public mostrarProductos() {
    return this.http.get('http://localhost:3000/productosWS/listarProductos', { headers: this.headers });
  }
  public aniadirProducto(nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, puntosProducto: number, precioUnitarioProducto: number, idCategoria: number, idAlmacen: number) {
    return this.http.post('http://localhost:3000/productosWS/agregarProducto', { nombreProducto, detalleProducto, contenidoProducto, fechaCaducidadProducto, paisOrigenProducto, puntosProducto, precioUnitarioProducto, idCategoria, idAlmacen }, { headers: this.headers });
  }
  public actualizarProducto(idProducto: number, nombreProducto: string, detalleProducto: string, contenidoProducto: string, fechaCaducidadProducto: string, paisOrigenProducto: string, stockProducto:number, puntosProducto: number, precioUnitarioProducto: number, idCategoria: number, idAlmacen: number) {
    return this.http.put(`http://localhost:3000/productosWS/actualizarProducto/${idProducto}`, { nombreProducto, detalleProducto, contenidoProducto, fechaCaducidadProducto, paisOrigenProducto, stockProducto, puntosProducto, precioUnitarioProducto, idCategoria, idAlmacen }, { headers: this.headers });
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

  //WS PARA TIPOS DE CLIENTES
  public mostrarTiposDeClientes() {
    return this.http.get('http://localhost:3000/tiposClientesWS/listarTiposClientes', { headers: this.headers });
  }
  public aniadirTipoDeClientes(tipoCliente: string, descripcionTipoCliente: string) {
    return this.http.post('http://localhost:3000/tiposClientesWS/agregarTipoCliente', {tipoCliente, descripcionTipoCliente }, { headers: this.headers });
  }
  public actualizarTipoDeClientes(idTipoCliente: number, tipoCliente: string, descripcionTipoCliente: string) {
    return this.http.put(`http://localhost:3000/tiposClientesWS/actualizarTipoCliente/${idTipoCliente}`, {idTipoCliente, tipoCliente, descripcionTipoCliente }, { headers: this.headers });
  }
  public borrarTipoDeClientes(idTipoCliente: number) {
    return this.http.delete(`http://localhost:3000/tiposClientesWS/eliminarTipoCliente/${idTipoCliente}`, { headers: this.headers });
  }

  //WS PARA TIPOS DE PAGOS
  public mostrarTiposDePagos() {
    return this.http.get('http://localhost:3000/tiposPagosWS/listarTiposPagos', { headers: this.headers });
  }
  public aniadirTipoDePago(tipoPago: string, viaTipoPago: string, descripcionTipoPago: string) {
    return this.http.post('http://localhost:3000/tiposPagosWS/agregarTipoPago', {tipoPago, viaTipoPago, descripcionTipoPago }, { headers: this.headers });
  }
  public actualizarTipoDePago(idTipoPago: number, tipoPago: string, viaTipoPago: string, descripcionTipoPago: string) {
    return this.http.put(`http://localhost:3000/tiposPagosWS/actualizarTipoPago/${idTipoPago}`, { idTipoPago, tipoPago, viaTipoPago, descripcionTipoPago }, { headers: this.headers });
  }
  public borrarTipoDePago(idTipoPago: number) {
    return this.http.delete(`http://localhost:3000/tiposPagosWS/eliminarTipoPago/${idTipoPago}`, { headers: this.headers });
  }

  //WS PARA TIPOS DE PROBLEMAS
  public mostrarTiposDeProblemas() {
    return this.http.get('http://localhost:3000/tiposProblemasWS/listarTiposProblemas', { headers: this.headers });
  }
  public aniadirTipoDeProblema(tipoProblema:number) {
    return this.http.post('http://localhost:3000/tiposProblemasWS/agregarTipoProblema', {tipoProblema}, { headers: this.headers });
  }
  public actualizarTipoDeProblema(idTipoProblema: number,tipoProblema:string) {
    return this.http.put(`http://localhost:3000/tiposProblemasWS/actualizarTipoProblema/${idTipoProblema}`, {tipoProblema}, { headers: this.headers });
  }
  public borrarTipoDeProblema(idTipoProblema: number) {
    return this.http.delete(`http://localhost:3000/tiposProblemasWS/eliminarTipoProblema/${idTipoProblema}`, { headers: this.headers });
  }

  //WS PARA TIPOS DE USUARIOS
  public mostrarTiposDeUsuarios() {
    return this.http.get('http://localhost:3000/tiposUsuariosWS/listarTiposUsuarios', { headers: this.headers });
  }
  public aniadirTipoDeUsuario(tipoUsuario:string,descripcionTipoUsuario:string) {
    return this.http.post('http://localhost:3000/tiposUsuariosWS/agregarTipoUsuario', {tipoUsuario,descripcionTipoUsuario}, { headers: this.headers });
  }
  public actualizarTipoDeUsuario(idTipoUsuario:number,tipoUsuario:string,descripcionTipoUsuario:string) {
    return this.http.put(`http://localhost:3000/tiposUsuariosWS/actualizarTipoUsuario/${idTipoUsuario}`, {tipoUsuario,descripcionTipoUsuario}, { headers: this.headers });
  }
  public borrarTipoDeUsuario(idTipoUsuario: number) {
    return this.http.delete(`http://localhost:3000/tiposUsuariosWS/eliminarTipoUsuario/${idTipoUsuario}`, { headers: this.headers });
  }


  //WS PARA ENTIDAD USUARIOS
  public mostrarUsuarios() {
    return this.http.get('http://localhost:3000/usuariosWS/listarUsuarios', { headers: this.headers });
  }
  public aniadirUsuario(nombreUsuario:string,emailUsuario:string,contraseniaUsuario:string,idVendedor:number,idTipoUsuario:number) {
    return this.http.post('http://localhost:3000/usuariosWS/agregarUsuario', {nombreUsuario,emailUsuario,contraseniaUsuario,idVendedor,idTipoUsuario }, { headers: this.headers });
  }
  public actualizarUsuario(idUsuario:number,nombreUsuario:string,emailUsuario:string,contraseniaUsuario:string,idVendedor:number,idTipoUsuario:number) {
    return this.http.put(`http://localhost:3000/usuariosWS/actualizarUsuario/${idUsuario}`, { idUsuario,nombreUsuario,emailUsuario,contraseniaUsuario,idVendedor,idTipoUsuario}, { headers: this.headers });
  }
  public borrarUsuario(idUsuario: number) {
    return this.http.delete(`http://localhost:3000/usuariosWS/eliminarUsuario/${idUsuario}`, { headers: this.headers });
  }
  public buscarUsuarioPorNombre(nombreUsuario: string) {
    return this.http.get(`http://localhost:3000/usuariosWS/buscarUsuarioPorNombre/${nombreUsuario}`, { headers: this.headers });
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
