import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import {APIService} from './api.service'
@Injectable({
  providedIn: 'root'
})
export class LoginJwtService {
  public headers = new HttpHeaders();
  constructor(private http: HttpClient, private router: Router, public API:APIService) { }

  public login(usuario: string, contrasena: string) {
    console.log("estas son las cabeceras: ",this.headers)
    this.http.post('http://localhost:3000/loginWS/autenticarUsuarios', { nombreUsuario: usuario, contraseniaUsuario: contrasena }, {headers: this.headers}).subscribe(
        (resp: any) => {
          let _nombreUsuario: string = "";
          //me aseguro que exista el usuario mediante una comprobacion al array
          console.log("contenido resp",resp.respuesta);
          if (resp.estatus > 0) {
            localStorage.setItem("nombreUsuario", usuario.toLowerCase());//almacenamos variables en LS
            localStorage.setItem('token', resp.respuesta); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
            this.router.navigate(['/home']);
            _nombreUsuario = localStorage.getItem('nombreUsuario')
            this.encontrarUsuario(_nombreUsuario);
          }else{
            alert("verifica tus datos");
          }
      },
    (error)=>{
      console.log("este es tu error:",error);
    });
  }

  //REGISTRAR ACCESO
  public agregarAcceso(idUsuario:number){
    this.API.aniadirAcceso('acceso',idUsuario).subscribe(
      ()=>{
        console.log("se capturo correctamente al usuario")
      },
      (error)=>{
        console.log("No se capturo usuario",error)
      }
    );
  }

  //BUSCAREMOS EL USUARIO SEGUN SU NOMBRE PARA PODER RASTREAR SU ID Y ANEXARLO A ACCESOS
  public encontrarUsuario(nombreUsuario:string){
    this.API.buscarUsuarioPorNombre(nombreUsuario).subscribe(
      (success:any)=>{
        let idCapturado:number = 0;
        idCapturado = success.respuesta[0].idUsuario;
        this.agregarAcceso(idCapturado); //ANEXAMOS EL USUARIO EN SESION A LA BITACORA DE ACCESOS
      },
      (error)=>{
        console.log("hubo un problema", error);
      }
    );
  }
  public verificarRecargadoPagina(){
    if (window.onload) {
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
    }
  }
  public logout(){
    localStorage.removeItem('token');
  }

}
