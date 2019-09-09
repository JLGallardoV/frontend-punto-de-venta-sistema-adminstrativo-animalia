import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {ProveedoresComponent} from './proveedores/proveedores.component';
import {TransaccionesComponent} from './transacciones/transacciones.component';
import {ClientesComponent} from './clientes/clientes.component';
import {FacturasComponent} from './facturas/facturas.component';
import {DevolucionesComponent} from './devoluciones/devoluciones.component';
import {ProductosComponent} from './productos/productos.component';
import {CategoriasComponent} from './categorias/categorias.component';
import {VendedoresComponent} from './vendedores/vendedores.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {AccesosComponent} from './accesos/accesos.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'transacciones', component: TransaccionesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'facturas', component: FacturasComponent},
  {path: 'productos', component: ProductosComponent},
  {path: 'devoluciones', component: DevolucionesComponent},
  {path: 'categorias', component: CategoriasComponent},
  {path: 'vendedores', component: VendedoresComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'accesos', component: AccesosComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
