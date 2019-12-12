import { Component } from '@angular/core';
//import { LoginJwtService } from './login-jwt.service';
import { Router } from '@angular/router'
import { FuncionamientoBitacoraService } from './funcionamiento-bitacora.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, public bitacora: FuncionamientoBitacoraService) {
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
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("contenido").style.opacity = 'initial';
    document.getElementById("contenido").style.pointerEvents = "unset";

  }
  /*INICIO REDIRECCION DE RUTAS*/
  public irTransacciones() {
    this.router.navigate(['/transacciones']);
    this.closeNav();

  }
  public irOperaciones() {
    this.router.navigate(['/facturas']);
    this.closeNav();

  }
  public irProductos() {
    this.router.navigate(['/productos']);
    this.closeNav();

  }
  public irDevoluciones() {
    this.router.navigate(['/devoluciones']);
    this.closeNav();

  }
  public irUsuarios() {
    this.router.navigate(['/usuarios']);
    this.closeNav();

  }
  public irReportes() {
    this.router.navigate(['/herramientas']);
    this.closeNav();

  }

  //BLOQUEAMOS ALGUNOS MODULOS PARA EVITAR ACCESO PERMITIDO A VENDEDORES
  public static denegarModulosVendedores() {
    setTimeout(() => {
      //esperamos a que se alcance a plasmar en el ls el nivel de acceso
      let memoriaNavegador: string = "";
      memoriaNavegador = localStorage.getItem('nivel');
      if (memoriaNavegador == 'vendedor') {
        console.log("vendedor en sesion");
        document.getElementById("main").style.display = "block";
        document.getElementById("idToolbar").style.display = "block";
        document.getElementById("etiquetaTransacciones").style.display = "none";
        document.getElementById("etiquetaProductos").style.display = "none";
        document.getElementById("etiquetaDevoluciones").style.display = "none";
        document.getElementById("etiquetaUsuarios").style.display = "none";
        document.getElementById("etiquetaReportes").style.display = "none";
      }
    }, 1000);
  }
  //ESTE METODO SE EJECUTA CADA QUE SE INICIA LA APLICACION POR PRIMERA VEZ
  public denegarVistaMenu() {
    console.log("reestructurando menu");
    let memoriaNavegador: string = "";
    memoriaNavegador = localStorage.getItem('nivel');
    //este if es para cuando inicia la aplicacion, oculta el menu.
    if (memoriaNavegador == null) {
      document.getElementById("idToolbar").style.display = "none";
      return;
    }
    //por si el vendedor no cierra la sesion y vuelve a abrir el modulo de operaciones no muestre los demas modulos en el menu
    AppComponent.denegarModulosVendedores();

    //si nada de lo anterior se cumple pues muestra el menu como tal
    document.getElementById("etiquetaTransacciones").style.display = "block";
    document.getElementById("etiquetaProductos").style.display = "block";
    document.getElementById("etiquetaDevoluciones").style.display = "block";
    document.getElementById("etiquetaUsuarios").style.display = "block";
    document.getElementById("etiquetaReportes").style.display = "block";
  }

  /*FIN REDIRECCION DE RUTAS*/


  //BOTON PARA SALIR DE LA APP DESDE EL MENU
  public logout() {
    document.getElementById("idToolbar").style.display = "none";
    //this.JWT.logout();
    let accion: string = "salida"
    this.bitacora.registrarAcceso(accion, localStorage.getItem('usuario'));
    localStorage.clear();
    setTimeout(() => {
      /*lo meto en un setTimeout para evitar que redirija al login y borre el ls
      ya que de tal manera no se registraria el usuario en la bitacora*/
      console.log("sesion cerrada");
      this.router.navigate(['/login']);
    }, 3000);
    this.closeNav();
  }
  ngOnInit() {
    setTimeout(() => {
      /*lo meto en un settimeout para que deje
      cargar primero el login (en su caso) y alcance a borrar el ls
      y no muestre el menu por detectar valores en el ls
      esto esta planeado para la primera vez que la app es lanzada
      o en el caso de cerra la app si borrar el ls*/
      this.denegarVistaMenu();
    }, 500);
  }
}
