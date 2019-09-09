import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {ProveedoresComponent} from './proveedores/proveedores.component';
import {TransaccionesComponent} from './transacciones/transacciones.component';
import {ClientesComponent} from './clientes/clientes.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'transacciones', component: TransaccionesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: '', redirectTo: 'clientes', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
