import { Component } from '@angular/core';
import {LoginJwtService} from './login-jwt.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private JWT:LoginJwtService,private router: Router){
  }
  title = 'puntoVentaMascotas';
  public openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("contenido").style.opacity = "0.4";
    document.getElementById("contenido").style.pointerEvents = "none";

  }

  public closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("contenido").style.opacity = 'initial';
    document.getElementById("contenido").style.pointerEvents = "unset";

  }
  /*INICIO REDIRECCION DE RUTAS*/
  public irTransacciones(){
    this.router.navigate(['/transacciones']);
    this.closeNav();

  }
  public irOperaciones(){
    this.router.navigate(['/facturas']);
    this.closeNav();

  }
  public irProductos(){
    this.router.navigate(['/productos']);
    this.closeNav();

  }
  public irDevoluciones(){
    this.router.navigate(['/devoluciones']);
    this.closeNav();

  }
  public irUsuarios(){
    this.router.navigate(['/usuarios']);
    this.closeNav();

  }
  public irReportes(){
    this.router.navigate(['/herramientas']);
    this.closeNav();

  }

  public denegarVistaMenu(){
    if(localStorage.getItem('nivel') == 'vendedor'){
      document.getElementById("etiquetaTransacciones").style.display = "none";
      document.getElementById("etiquetaProductos").style.display = "none";
      document.getElementById("etiquetaDevoluciones").style.display = "none";
      document.getElementById("etiquetaUsuarios").style.display = "none";
      document.getElementById("etiquetaReportes").style.display = "none";
    }else{
      document.getElementById("etiquetaTransacciones").style.display = "block";
      document.getElementById("etiquetaProductos").style.display = "block";
      document.getElementById("etiquetaDevoluciones").style.display = "block";
      document.getElementById("etiquetaUsuarios").style.display = "block";
      document.getElementById("etiquetaReportes").style.display = "block";
    }

  }

  /*FIN REDIRECCION DE RUTAS*/
  public logout(){
    this.JWT.logout();
    this.closeNav();
  }
  ngOnInit(){
    setTimeout(()=>{
      this.denegarVistaMenu();
    },1000);
  }
}
