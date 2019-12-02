import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  constructor(public API: APIService, public guardian:LoginJwtService) {

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
  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsAccesos.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsAccesos.paginator ? this.dsAccesos.paginator.firstPage(): null;
  }
  ngOnInit() {
    this.listarAccesos();
  }

}
