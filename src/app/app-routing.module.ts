import { NgModule } from '@angular/core';
import { Routes, RouterModule,CanActivate } from '@angular/router';
import{AuthGuard}from './auth.guard';
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
import {ComprasComponent} from './compras/compras.component';
import {HerramientasComponent} from './herramientas/herramientas.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'proveedores', component: ProveedoresComponent,canActivate:[AuthGuard]},
  {path: 'transacciones', component: TransaccionesComponent,canActivate:[AuthGuard]},
  {path: 'clientes', component: ClientesComponent,canActivate:[AuthGuard]},
  {path: 'facturas', component: FacturasComponent,canActivate:[AuthGuard]},
  {path: 'productos', component: ProductosComponent,canActivate:[AuthGuard]},
  {path: 'devoluciones', component: DevolucionesComponent,canActivate:[AuthGuard]},
  {path: 'categorias', component: CategoriasComponent,canActivate:[AuthGuard]},
  {path: 'vendedores', component: VendedoresComponent,canActivate:[AuthGuard]},
  {path: 'usuarios', component: UsuariosComponent,canActivate:[AuthGuard]},
  {path: 'accesos', component: AccesosComponent,canActivate:[AuthGuard]},
  {path: 'compras', component: ComprasComponent,canActivate:[AuthGuard]},
  {path: 'herramientas', component: HerramientasComponent,canActivate:[AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'} //EN CASO DE QUE EL USUARIO SE INVENTE UNA RUTA
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
