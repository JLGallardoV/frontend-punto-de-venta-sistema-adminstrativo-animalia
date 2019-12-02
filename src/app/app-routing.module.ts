import { NgModule } from '@angular/core';
import { Routes, RouterModule,CanActivate } from '@angular/router';
import{AuthGuard}from './auth.guard';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {TransaccionesComponent} from './transacciones/transacciones.component';
import {FacturasComponent} from './facturas/facturas.component';
import {DevolucionesComponent} from './devoluciones/devoluciones.component';
import {ProductosComponent} from './productos/productos.component';
import {UsuariosComponent} from './usuarios/usuarios.component';
import {HerramientasComponent} from './herramientas/herramientas.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent,canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'transacciones', component: TransaccionesComponent,canActivate:[AuthGuard]},
  {path: 'facturas', component: FacturasComponent,canActivate:[AuthGuard]},
  {path: 'productos', component: ProductosComponent,canActivate:[AuthGuard]},
  {path: 'devoluciones', component: DevolucionesComponent,canActivate:[AuthGuard]},
  {path: 'usuarios', component: UsuariosComponent,canActivate:[AuthGuard]},
  {path: 'herramientas', component: HerramientasComponent,canActivate:[AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'} //EN CASO DE QUE EL USUARIO SE INVENTE UNA RUTA
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
