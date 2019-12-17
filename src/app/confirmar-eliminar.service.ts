import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmarEliminarService {

  constructor() { }

  //MODIFICA EL ALERT AL ELIMINAR ALGUN PRODUCTO
  public confirmarEliminacion(): boolean {
    let opcion = confirm("¿Estas seguro que deseas eliminar el elemento?");
    if (opcion == true) {
      return true;
    } else {
      return false;
    }
  }

}
