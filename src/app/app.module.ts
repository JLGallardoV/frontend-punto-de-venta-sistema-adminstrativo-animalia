import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ProveedoresComponent, BottomSheetOverviewExampleSheet } from './proveedores/proveedores.component';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TransaccionesComponent, BottomSheetTransacciones} from './transacciones/transacciones.component';
import { ClientesComponent, BottomSheetClientes} from './clientes/clientes.component';
import { FacturasComponent, BottomSheetFacturas} from './facturas/facturas.component';
import { ProductosComponent, BottomSheetProductos} from './productos/productos.component';
import { DevolucionesComponent, BottomSheetDevoluciones} from './devoluciones/devoluciones.component';
import { CategoriasComponent, BottomSheetCategorias} from './categorias/categorias.component';
import { VendedoresComponent, BottomSheetVendedores} from './vendedores/vendedores.component';
import { UsuariosComponent, BottomSheetUsuarios} from './usuarios/usuarios.component';
import { AccesosComponent, BottomSheetAccesos} from './accesos/accesos.component';
import { HerramientasComponent, BottomSheetHerramientas } from './herramientas/herramientas.component';
import { HttpClientModule } from '@angular/common/http';
import { ComprasComponent, BottomSheetCompras } from './compras/compras.component';
import{AuthGuard} from './auth.guard';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BottomSheetOverviewExampleSheet, //bottomSheet lo agregue en proveedores
    BottomSheetTransacciones,
    BottomSheetClientes,
    BottomSheetCompras,
    BottomSheetFacturas,
    BottomSheetDevoluciones,
    BottomSheetProductos,
    BottomSheetVendedores,
    BottomSheetCategorias,
    BottomSheetUsuarios,
    BottomSheetAccesos,
    BottomSheetHerramientas,
    ProveedoresComponent, TransaccionesComponent, ClientesComponent, FacturasComponent, ProductosComponent, DevolucionesComponent, CategoriasComponent, VendedoresComponent, UsuariosComponent, AccesosComponent, HerramientasComponent, ComprasComponent, ConfiguracionComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatBottomSheetModule
  ],
  entryComponents: [
    BottomSheetOverviewExampleSheet,
    BottomSheetTransacciones,
    BottomSheetCompras,
    BottomSheetFacturas,
    BottomSheetProductos,
    BottomSheetDevoluciones,
    BottomSheetCategorias,
    BottomSheetVendedores,
    BottomSheetUsuarios,
    BottomSheetAccesos,
    BottomSheetHerramientas,
    BottomSheetClientes], //bottomsheet
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
