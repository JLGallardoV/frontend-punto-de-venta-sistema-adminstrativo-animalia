import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionamientoBitacoraService {
  public headers = new HttpHeaders();
  constructor(public http:HttpClient) { }

    //INCIO - REGISTRAR ACCESO
    //esta funcion es invocada una vez se detecta el usuario a añadir
    public agregarAcceso(accionAcceso:string,idUsuario: number) {
      console.log("accion: ",accionAcceso)
      this.http.post('http://localhost:3000/accesosWS/agregarAcceso', {accionAcceso,idUsuario}, { headers: this.headers }).subscribe(
        (success:any)=>{
          console.log("usuario/accion capturados exitosamente [ ",success.respuesta," ]");
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

}
