import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { RecuperarContraseniaService } from '../recuperar-contrasenia.service';
import { sha256 } from 'js-sha256';


@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss']
})

export class RecuperarContraseniaComponent implements OnInit {
  public frmRecuperarContrasenia: FormGroup;
  public formValid: Boolean = false;
  public coincidencia: Boolean;


  constructor(public actRoute:ActivatedRoute,public router:Router,public formBuilder: FormBuilder,public API:RecuperarContraseniaService) {
    this.coincidencia = false;
    this.frmRecuperarContrasenia = this.formBuilder.group({
      nuevaContrasenia: ["", Validators.required],
      confirmarContrasenia: ["", Validators.required],
    });
    this.obtenerToken();

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

  //VERIFICAR QUE EL TOKEN SEA EL CORRECTO, Y QUE NO CUALQUIERA ACCEDA A ESTE MODULO
  public obtenerToken(){
    this.actRoute.queryParams.subscribe((params: any) => {
      let token:string ="";
      token = params['token'];
      //console.log("jwt recibido en el cliente: ",token)
      this.API.verificarToken(token).subscribe(
        (success:any)=>{
          if (success.estatus != 1) {
              this.router.navigate(['/login']);
              setTimeout(
                ()=>{
                  alert(success.respuesta);
                },0);
              return;
          }
          console.log("token valido")
        },
        (error:any)=>{
          console.log("error: ",error);
          this.router.navigate(['/login']);
        }
      );
    });
  }

  //ENVIAR LA NUEVA CONTRASENIA AL SERVIDOR
  public actualizarContrasenia(){
    this.actRoute.queryParams.subscribe((params: any) => {
      let idUsuario = params['idUsuario'];
      let nuevaContrasenia = this.frmRecuperarContrasenia.get('confirmarContrasenia').value;
      this.API.sustituirContrasenia(idUsuario,sha256(nuevaContrasenia)).subscribe(
        (success:any)=>{
          if (success.estatus == 1) {
            alert(success.respuesta);
              setTimeout(
                ()=>{
                  this.router.navigate(['/login']);
                },0);
              return;
          }
          console.log("success de actualizar: ",success);
        },
        (error:any)=>{
          console.log("error: ",error);
          this.router.navigate(['/login']);
        }
      );
    });
  }

  ngOnInit() {
  }

}
