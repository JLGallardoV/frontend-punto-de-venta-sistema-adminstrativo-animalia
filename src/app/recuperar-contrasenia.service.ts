import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecuperarContraseniaService {
  public headers = new HttpHeaders();
  constructor(public http: HttpClient) { }

  public enviarCorreo(usuario:string) {
    console.log("este usuario entro: ",usuario);
    this.http.get(`http://localhost:3000/usuariosWS/buscarUsuarioPorNombre/${usuario}`, { headers: this.headers }).subscribe(
      (success: any) => {
        if (success.estatus == 0) {
          alert("Verifica que tu usuario se el correcto");
          return;
        }
        let emailUsuario = success.respuesta[0].emailUsuario;
        console.log("enviando correo a: ", emailUsuario);
        this.http.post(`http://localhost:3000/loginWS/recuperarContrasenia`, { emailUsuario }, { headers: this.headers }).subscribe(
          (success: any) => {
            alert("Revisa tu email para reestablecer tu contraseña | En caso de no encontrar tu correo en la bandeja de entrada, revisa tu spam");
            console.log("mensaje exitoso completo: ", success.respuesta)
          },
          (error: any) => {
            console.log("este es el error", error)
          }
        );
      },
      (error: any) => {
        alert("Verifica tu usuario");
        console.log("verdadero error: ", error);
      }
    );
  }

}
