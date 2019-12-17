import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmarEliminarService {

  constructor() { }

  //MODIFICA EL ALERT AL ELIMINAR ALGUN PRODUCTO
  public confirmarEliminacion(){
    let mensaje: string = "";
      let opcion = confirm("Clicka en Aceptar o Cancelar");
      if (opcion == true) {
          console.log(mensaje = "Has clickado OK");
  	} else {
          console.log(mensaje = "Has clickado Cancelar");
  	}
  }
}
