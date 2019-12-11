import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class GenerarPDFsService {

  constructor() {
  }
  public generarPDF(etiquetaPDF:string){
  //document.getElementById('LogoPDF').style.display = "block";
  var data = document.getElementById(etiquetaPDF);
  html2canvas(data).then(canvas => {

    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4');
    var position = 7;
    pdf.addImage(contentDataURL, 'PNG', 7, position, imgWidth, imgHeight)
    pdf.save('animalia-PDF.pdf');
  });
  //document.getElementById('LogoPDF').style.display = "none";
}

}
