import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { APIService } from './api.service';
import {AppComponent} from './app.component';
@Injectable({
  providedIn: 'root'
})
export class LoginJwtService {
  public headers = new HttpHeaders();
  constructor(private http: HttpClient, private router: Router, public API: APIService) { }

  public login(nombreUsuario: string, contraseniaUsuario: string) {
    this.http.post('http://localhost:3000/loginWS/autenticarUsuarios', { nombreUsuario, contraseniaUsuario}, { headers: this.headers }).subscribe(
      (resp: any) => {
        if (resp.estatus > 0) {

          console.log("respueta", resp.estatus, " contenido: ", resp.respuesta);
          localStorage.setItem('token', resp.respuesta); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          localStorage.setItem('usuario', nombreUsuario); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          this.router.navigate(['/facturas']);
          document.getElementById("main").style.display = "block";
          this.registrarAcceso(nombreUsuario); //añadimos el usuario en sesion a la bitacora de accesos

        } else {
          alert("verifica tus datos");
        }
      },
      (error) => {
        console.log("este es tu error:", error);
      });
  }



  //INCIO - REGISTRAR ACCESO
  //esta funcion es invocada una vez se detecta el usuario a añadir
  public agregarAcceso(idUsuario: number) {
    this.API.aniadirAcceso('acceso', idUsuario).subscribe(
      () => {
        console.log("se capturo correctamente al usuario")
      },
      (error) => {
        console.log("No se capturo usuario", error)
      }
    );
  }

  //buscamos el usuario segun su nombre para asi registrar su accesos en la bd
  public registrarAcceso(nombreUsuario: string) {
    this.API.buscarUsuarioPorNombre(nombreUsuario).subscribe(
      (success: any) => {
        let idCapturado: number = 0;
        idCapturado = success.respuesta[0].idUsuario;
        this.agregarAcceso(idCapturado); //anexamos a la db el usuario en acceso
        //almaceno el nivel en ls para poder restringir accesos a modulos
        let nivel: string = success.respuesta[0].tipoUsuario;
        console.log("este sera tu nivel: ",nivel," fuente: ",success.respuesta);
        localStorage.setItem('nivel', nivel);

      },
      (error) => {
        console.log("hubo un problema", error);
      }
    );
  }
  //FIN - REGISTRAR ACCESO



  //EVITAR ACCESO DE VENDEDORES A MODULOS DEL GERENTE
  public restringirAcceso() {
    let cerrarMenu:AppComponent;
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');

    if (nivel != 'gerente') {
      this.logout();
      this.router.navigate(['/login']);
      cerrarMenu.closeNav()
      setTimeout(
        ()=>{
          alert('Verifica que eres gerente');
        }
      );
    }
  }



  //SALIR DE LA CUENTA ACTUAL
  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
