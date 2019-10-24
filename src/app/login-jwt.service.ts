import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginJwtService {
  public headers = new HttpHeaders();
  constructor(private http: HttpClient, private router: Router) { }

  public login(usuario: string, contrasena: string) {
    console.log("estas son las cabeceras: ",this.headers)
    this.http.post('http://localhost:3000/loginWS/autenticarUsuarios', { nombreUsuario: usuario, contraseniaUsuario: contrasena }, {headers: this.headers})
      .subscribe((resp: any) => {
        window.localStorage.setItem("nombreUsuario", usuario.toLowerCase());//almacenamos variables en LS
        localStorage.setItem('token', resp.respuesta); //almacenamos el token en localstorage NOTA respuesta viene del servidor y contiene el token
        this.router.navigate(['/home']);
      },
    (error)=>{
      console.log("este es tu error:",error);
    });
  }
  public logout(){
    localStorage.removeItem('token');
  }
}
