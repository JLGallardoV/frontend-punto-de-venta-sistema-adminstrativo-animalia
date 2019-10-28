import { Component, OnInit, ViewChild } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

export interface PeriodicElement {
  idTransaccion: number;
  fechaTransaccion: string;
  cantidadProductos: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {idTransaccion: 1, fechaTransaccion: '2019-10-25', cantidadProductos: 12},
];

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  //elementos tabla
  displayedColumns: string[] = ['idTransaccion', 'fechaTransaccion', 'cantidadProductos'];
  dataSource = ELEMENT_DATA;
  public frmVenta: FormGroup;
  public formValid:Boolean=false;
  public arregloProductos: number[] = [];





  constructor(private _bottomSheet: MatBottomSheet, public formBuilder: FormBuilder) {
    this.frmVenta = this.formBuilder.group({
          idCliente:["",Validators.required],
          idVendedor:["",Validators.required],
          pagoTransaccion:["",Validators.required],
          productos:["",Validators.required],
          tiposDePagos:["",Validators.required]
        });
  }

  public llenarLista(){
    let transaferirValor: number = 0;
    transaferirValor = this.frmVenta.get('productos').value;
    this.arregloProductos.push(transaferirValor);


  }





  //bootsheet (menu)
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetFacturas);
  }

  ngOnInit() {
  }

}















//agregando bottomSheet (menu)
@Component({
  selector: 'bottomSheetFacturas',
  templateUrl: 'bottomSheetFacturas.html',
})
export class BottomSheetFacturas {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetFacturas>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
