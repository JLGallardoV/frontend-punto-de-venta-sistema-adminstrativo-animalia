import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss']
})

export class RecuperarContraseniaComponent implements OnInit {
  public frmRecuperarContrasenia: FormGroup;
  public formValid: Boolean = false;
  public coincidencia: Boolean;


  constructor(public formBuilder: FormBuilder) {
    this.coincidencia = false;
    this.frmRecuperarContrasenia = this.formBuilder.group({
      nuevaContrasenia: ["", Validators.required],
      confirmarContrasenia: ["", Validators.required],
    });

  }

  //VALIDAR QUE EL CONFIRMADO DE CONTRASEÑA SEA CORRECTO
  public confirmarContrasenia(event:any){
    let nuevaContrasenia = this.frmRecuperarContrasenia.get('nuevaContrasenia').value;
    let confirmarContrasenia = this.frmRecuperarContrasenia.get('confirmarContrasenia').value;

    if (confirmarContrasenia != nuevaContrasenia) {
        console.log("falso");
        this.coincidencia = false;
        return this.coincidencia;
    }else{
      this.coincidencia = true;
      console.log("verdadero");
      return this.coincidencia;
    }

  }
  ngOnInit() {
  }

}
