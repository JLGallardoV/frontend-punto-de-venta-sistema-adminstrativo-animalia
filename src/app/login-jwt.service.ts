import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FuncionamientoBitacoraService } from './funcionamiento-bitacora.service';
import {AppComponent} from './app.component';

@Injectable({
  providedIn: 'root'
})
export class LoginJwtService {
  public headers = new HttpHeaders();
  constructor(private http: HttpClient, private router: Router,public bitacora:FuncionamientoBitacoraService, public menu:AppComponent) {
  }

  public login(nombreUsuario: string, contraseniaUsuario: string) {
    let accion:string = "acceso";
    this.http.post('http://localhost:3000/loginWS/autenticarUsuarios', { nombreUsuario, contraseniaUsuario}, { headers: this.headers }).subscribe(
      (resp: any) => {
        if (resp.estatus > 0) {
          localStorage.setItem('token', resp.respuesta); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          localStorage.setItem('usuario', nombreUsuario); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          this.bitacora.registrarAcceso(accion,nombreUsuario); //añadimos el usuario en sesion a la bitacora de accesos
          console.log("sesion iniciada");

          document.getElementById('idLogin').style.pointerEvents = "none"; //bloquea el evento click en el login
          document.getElementById('idLogin').style.opacity = "0.5";
          document.getElementById('idSpinner').style.display = "block"; //libera el spinner que simula la carga de la app
          document.getElementById('idSpinner').style.opacity = "1.0"; //libera el spinner que simula la carga de la app


          setTimeout(()=>{
            //pongo un setTimeout para que en el navegador se alcance a plasmar el localStorage
            this.headers = new HttpHeaders({
              'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
              'Content-Type': 'application/json',//tipo de contenido JSON
              'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
            });
              this.menu.cambiarEtiqueta();
              this.router.navigate(['/facturas']);
              AppComponent.denegarModulosVendedores();
            /*en este lapso puedes poner un spinner*/
          },3000);
        } else {
          alert("verifica tus datos");
        }
      },
      (error) => {
        console.log("este es tu error:", error);
      });
  }


  //EVITAR ACCESO DE VENDEDORES A MODULOS DEL GERENTE
  public restringirAcceso() {
    //let cerrarMenu:AppComponent;
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');

    if (nivel != 'gerente') {
      /*apesar de que el metodo logout redirige a login,
      redirijo yo primero ya que mencionado metodo contiene un setTimeout
      y por un momento se alcanza a notar el modulo a tratar de acceder*/
      this.router.navigate(['/login']);
      setTimeout(
        //este setTimeout se pone para que se cargue bien al login antes de enviar este msj y exista el idToolbar
        ()=>{
          document.getElementById("idToolbar").style.display = "none";
          alert('Verifica que eres gerente');
        },500);
    }
  }

}
