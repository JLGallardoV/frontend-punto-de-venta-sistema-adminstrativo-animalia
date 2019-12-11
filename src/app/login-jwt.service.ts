import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
//import { APIService } from './api.service';
import {AppComponent} from './app.component';
@Injectable({
  providedIn: 'root'
})
export class LoginJwtService {
  public headers = new HttpHeaders();
  constructor(private http: HttpClient, private router: Router) {
  }

  public login(nombreUsuario: string, contraseniaUsuario: string) {
    let accion:string = "acceso";
    this.http.post('http://localhost:3000/loginWS/autenticarUsuarios', { nombreUsuario, contraseniaUsuario}, { headers: this.headers }).subscribe(
      (resp: any) => {
        if (resp.estatus > 0) {
          localStorage.setItem('token', resp.respuesta); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          localStorage.setItem('usuario', nombreUsuario); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
          console.log("sesion iniciada");
          setTimeout(()=>{
            this.headers = new HttpHeaders({
              'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
              'Content-Type': 'application/json',//tipo de contenido JSON
              'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
            });
            this.registrarAcceso(accion,nombreUsuario); //añadimos el usuario en sesion a la bitacora de accesos
            this.router.navigate(['/facturas']);
            document.getElementById("idToolbar").style.display = "block";
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


/*ENCONTRAR OTRA MANERA DE REGISTRAR EN LA BITACORA*/
  //INCIO - REGISTRAR ACCESO
  //esta funcion es invocada una vez se detecta el usuario a añadir
  public agregarAcceso(accionAcceso:string,idUsuario: number) {
    console.log("accion: ",accionAcceso)
    this.http.post('http://localhost:3000/accesosWS/agregarAcceso', {accionAcceso,idUsuario}, { headers: this.headers }).subscribe(
      (success:any)=>{
        console.log("usuario/accion capturados exitosamente");
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //buscamos el usuario segun su nombre para asi registrar su accesos en la bd
  public registrarAcceso(accion:string,nombreUsuario: string) {
    this.http.get(`http://localhost:3000/usuariosWS/buscarUsuarioPorNombre/${nombreUsuario}`, { headers: this.headers }).subscribe(
      (success: any) => {
        let idCapturado: number = 0;
        let nivel:string = "";
        nivel = success.respuesta[0].tipoUsuario;//obtengo el nivel de acceso del usuario para el uso conveniente posteriormente
        localStorage.setItem('nivel', nivel);
        idCapturado = success.respuesta[0].idUsuario;
        this.agregarAcceso(accion,idCapturado); //anexamos a la db el usuario en acceso invocando tal metodo
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
      setTimeout(
        ()=>{
          alert('Verifica que eres gerente');
          cerrarMenu.closeNav()
        }
      );
    }
  }



  //SALIR DE LA CUENTA ACTUAL
  public logout() {
    let accion: string = "salida"
    this.registrarAcceso(accion,localStorage.getItem('usuario'));
    localStorage.clear();
    setTimeout(()=>{
      console.log("sesion cerrada");
      this.router.navigate(['/login']);
    },3000);

  }

}
