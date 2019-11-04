import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }
  //FORMATEO FECHA YA QUE EL INPUT TIPO DATE ME LA MANDA EN UN FORMATO INCOMPATIBLE CON MI SGBD
  public formatearFecha(objFecha): string {
  var fechaParametro = new Date(objFecha);
  var anio = fechaParametro.getFullYear();

  //anadimos el 0 en la izquierda en caso de ser un 1 numero de 1 cifra
  var mes = fechaParametro.getMonth();
  var mes = mes + 1;
  if (mes.toString().length == 2) {
    var mesString = mes.toString();

  }else if(mes.toString().length == 1){
    var mesString = '0' + mes.toString();

  }
  //anadimos el 0 en la izquierda en caso de ser un 1 numero de 1 cifra
  var dia = fechaParametro.getDate();
  if (dia.toString().length == 2) {
     var diaString = dia.toString();

  }else if(dia.toString().length == 1){
    var diaString = '0' + dia.toString();

  }


  var fechaFinal = anio + '-' + mesString + '-' + diaString;
  return fechaFinal;

}
}
