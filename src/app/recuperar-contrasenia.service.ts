import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RecuperarContraseniaService {
  public headers: any;
  constructor(public actRoute: ActivatedRoute, public http: HttpClient) {
    this.actRoute.queryParams.subscribe((params: any) => {
      let token: string = "";
      token = params['token'];
      localStorage.setItem('token', token);
    });
    setTimeout(() => {
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'), //token almacenado en LS
        'Content-Type': 'application/json',//tipo de contenido JSON
        'Accept': 'application/json' //acepta el cuerpo de la peticion JSON
      });
      console.log("token de recuperar: ", localStorage.getItem('token'));
    }, 0);
  }
  //ENVIA CORREO DESDE EL LOGIN
  public enviarCorreo(usuario: string) {
    console.log("este usuario entro: ", usuario);
    this.http.get(`http://localhost:3000/usuariosWS/buscarUsuarioPorNombre/${usuario}`, { headers: this.headers }).subscribe(
      (success: any) => {
        if (success.estatus == 0) {
          alert("Verifica que tu usuario se el correcto");
          return;
        }
        let idUsuario = success.respuesta[0].idUsuario;
        let emailUsuario = success.respuesta[0].emailUsuario;

        console.log("enviando correo a: ", emailUsuario, " \n idUsuario", idUsuario);
        this.http.post(`http://localhost:3000/loginWS/enviarEmail`, { emailUsuario, idUsuario }, { headers: this.headers }).subscribe(
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


  //VERIFICA QUE EL USUARIO TRAIGA EL JWT CORRECTO PARA PERMITIRLE ACCESO AL FORMULARIO
  public verificarToken(jwt: string) {
    return this.http.post(`http://localhost:3000/loginWS/validarToken`, { jwt }, { headers: this.headers });
  }


  //ACTUALIZA LA CONTRASEÑA
  public sustituirContrasenia(idUsuario: number, contraseniaUsuario: string) {
    console.log("usuario en api: ", idUsuario);
    return this.http.post(`http://localhost:3000/loginWS/nuevaContrasenia`, { idUsuario, contraseniaUsuario }, { headers: this.headers });
  }


}
