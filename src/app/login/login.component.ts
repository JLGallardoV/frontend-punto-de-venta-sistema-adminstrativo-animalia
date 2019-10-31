import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginJwtService } from '../login-jwt.service';
import { sha256} from 'js-sha256';

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
   public arregloTiposDeUsuarios:ITiposDeUsuarios[] = [{idTipoUsuario:1,tipoUsuario:"admin"}];

  constructor(public router: Router,public formBuilder: FormBuilder, private jwt: LoginJwtService){
    this.frmLogin = this.formBuilder.group({
          nombreUsuario:["",Validators.required],
          passwordUsuario:["",Validators.required],
          tipoUsuario:["",Validators.required]
        });

  //this.arregloTiposDeUsuarios=[{idTipoUsuario:1,tipoUsuario:"admin"}]
  }
  public login() {
    var constrasenaEncriptada = sha256(this.frmLogin.get('passwordUsuario').value)//Encriptacion de constraña sha256
    this.jwt.login(this.frmLogin.get('nombreUsuario').value, constrasenaEncriptada);//invocando metodo con la peticon del login, proveniente del servicio
  }
  ngOnInit() {
  }

}
