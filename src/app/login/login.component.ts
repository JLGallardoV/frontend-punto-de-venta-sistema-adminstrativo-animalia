import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   public frmLogin: FormGroup;
   public formValid:Boolean=false;

  constructor(public router: Router,public formBuilder: FormBuilder){
    this.frmLogin = this.formBuilder.group({
          emailUsuario:["",Validators.required],
          passwordUsuario:["",Validators.required],
          tipoUsuario:["",Validators.required]
        });
  }

  ngOnInit() {
  }

}
