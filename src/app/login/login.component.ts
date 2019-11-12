import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginJwtService } from '../login-jwt.service';
import { sha256} from 'js-sha256';
import { APIService} from '../api.service';

export interface ITiposDeUsuarios {
  idTipoUsuario: number;
  tipoUsuario: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   public frmLogin: FormGroup;
   public formValid:Boolean=false;
   public arregloTiposDeUsuarios:ITiposDeUsuarios[];

  constructor(public router: Router,public formBuilder: FormBuilder, private jwt: LoginJwtService,public API:APIService){
    this.frmLogin = this.formBuilder.group({
          nombreUsuario:["",Validators.required],
          passwordUsuario:["",Validators.required],
          tipoUsuario:["",Validators.required]
        });
  }

  //CARGAR TIPOS DE USUARIO EN EL SELECT
  public listartTiposUsuarios(){
    this.API.mostrarTiposDeUsuarios().subscribe(
      (success:any)=>{
        this.arregloTiposDeUsuarios = success.respuesta;
        console.log(this.arregloTiposDeUsuarios);
      },
      (error)=>{

      }
    );
  }

  public login() {
    var constrasenaEncriptada = sha256(this.frmLogin.get('passwordUsuario').value)//Encriptacion de constraña sha256
    this.jwt.login(this.frmLogin.get('nombreUsuario').value, constrasenaEncriptada,this.frmLogin.get('tipoUsuario').value);//invocando metodo con la peticon del login, proveniente del servicio
  }
  ngOnInit() {
    this.listartTiposUsuarios();
  }

}
