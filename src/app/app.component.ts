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
  //BLOQUEAMOS ALGUNOS MODULOS PARA EVITAR ACCESO PERMITIDO A VENDEDORES
  public denegarVistaMenu(){
    let memoriaNavegador: string = "";
    memoriaNavegador = localStorage.getItem('nivel');
    console.log("memoria: ",memoriaNavegador);
    //este if es para cuando inicia la aplicacion, oculta el menu.
    if( memoriaNavegador == null){
      console.log("memoria vacia")
      document.getElementById("idToolbar").style.display = "none";
      return;
    }
    //este if es para ocultar modulos al vendedor
    if(memoriaNavegador == 'vendedor'){
      document.getElementById("etiquetaTransacciones").style.display = "none";
      document.getElementById("etiquetaProductos").style.display = "none";
      document.getElementById("etiquetaDevoluciones").style.display = "none";
      document.getElementById("etiquetaUsuarios").style.display = "none";
      document.getElementById("etiquetaReportes").style.display = "none";
      return;
    }
    //si nada de lo anterior se cumple pues muestra el menu como tal
      document.getElementById("etiquetaTransacciones").style.display = "block";
      document.getElementById("etiquetaProductos").style.display = "block";
      document.getElementById("etiquetaDevoluciones").style.display = "block";
      document.getElementById("etiquetaUsuarios").style.display = "block";
      document.getElementById("etiquetaReportes").style.display = "block";
  }

  /*FIN REDIRECCION DE RUTAS*/


  //BOTON PARA SALIR DE LA APP DESDE EL MENU
  public logout(){
    document.getElementById("idToolbar").style.display = "none";
    this.JWT.logout();
    this.closeNav();
  }
  ngOnInit(){
    setTimeout(()=>{
      /*lo meto en un settimeout para que deje
      cargar primero el login (en su caso) y alcance a borrar el ls
      y no muestre el menu por detectar valores en el ls
      esto esta planeado para la primera vez que la app es lanzada
      o en el caso de cerra la app si borrar el ls*/
      this.denegarVistaMenu();
    },500);
  }
}
