import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { APIService, IAccesos } from '../api.service';
import {LoginJwtService} from '../login-jwt.service';
@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.scss']
})
export class AccesosComponent implements OnInit {
  displayedColumns: string[] = ['idAcceso', 'fechaAcceso', 'accionAcceso', 'nombreUsuario'];
  dsAccesos: MatTableDataSource<IAccesos>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private _bottomSheet: MatBottomSheet, public API: APIService, public guardian:LoginJwtService) {

  }

  //MENU INFERIOR BOTTOM SHEET
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetAccesos);
  }

  //LISTAR ACCESOS
  public listarAccesos(){
    this.API.mostrarAccesos().subscribe(
      (success:any)=>{
          this.dsAccesos = new MatTableDataSource(success.respuesta)
          this.dsAccesos.paginator = this.paginator;
      },
      (error)=>{
        console.log("hubo un problema", error);
      }
    );
  }

  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarAccesos();
  }

}

















@Component({
  selector: 'bottomSheetAccesos',
  templateUrl: 'bottomSheetAccesos.html',
})
export class BottomSheetAccesos {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetAccesos>) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
