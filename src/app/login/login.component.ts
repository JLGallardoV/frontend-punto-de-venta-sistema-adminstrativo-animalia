import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
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

  constructor(public router: Router,public formBuilder: FormBuilder, private jwt: LoginJwtService,public API:APIService,private _snackBar: MatSnackBar){
    this.frmLogin = this.formBuilder.group({
          nombreUsuario:["",Validators.required],
          passwordUsuario:["",Validators.required],
        });
  }

  openSnackBar() {
    this._snackBar.open('Comunicate: JLGallardoV@yandex.com', 'x', {
      duration: 10000,
    });
  }

  public login() {
    var constrasenaEncriptada = sha256(this.frmLogin.get('passwordUsuario').value)//Encriptacion de constraña sha256
    this.jwt.login(this.frmLogin.get('nombreUsuario').value,constrasenaEncriptada);//invocando metodo con la peticon del login, proveniente del servicio
  }

  ngOnInit() {
    document.getElementById("main").style.display = "none";

  }

}
