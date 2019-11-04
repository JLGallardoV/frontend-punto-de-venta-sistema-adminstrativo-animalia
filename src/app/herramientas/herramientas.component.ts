import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IReportesEconomicos, APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';
@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  styleUrls: ['./herramientas.component.scss']
})
export class HerramientasComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmFiltrado: FormGroup;
  public formValid:Boolean=false;

  displayedColumns: string[] = ['montoTransacciones', 'montoCompras', 'utilidad'];
  dsReporteEconomico: MatTableDataSource<IReportesEconomicos>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder, public API:APIService, public formateandoFecha:DateFormatService) {
    this.frmFiltrado = this.formBuilder.group({
          fechaInicio:["",Validators.required],
          fechaFinal:["",Validators.required]
        });
  }
  //MENU INFERIOR (bottomsheet)
  public openBottomSheet(): void {
  this._bottomSheet.open(BottomSheetHerramientas);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Proveedor";
  }

  //MOSTRAR REPORTES ECONOMICOS
  public generarReportes(){
  let fechaInicioForm: string = "";
  let fechaFinalForm: string = "";
  fechaInicioForm = this.frmFiltrado.get('fechaInicio').value;
  fechaFinalForm = this.frmFiltrado.get('fechaFinal').value;
  let fechaInicioFormateada = this.formateandoFecha.formatearFecha(fechaInicioForm);
  let fechaFinalFormateada = this.formateandoFecha.formatearFecha(fechaFinalForm);

  this.API.mostrarReporte(fechaInicioFormateada,fechaFinalFormateada).subscribe(
    (success:any) =>{
      //los valores vienen en matriz como estructura
      let valorTransacciones = success.respuesta[0][0].montoTransacciones;
      let valorCompras = success.respuesta[1][0].montoCompras;
      let valorUtilidad = success.respuesta[2][0].utilidad;

      let arregloReportesEconomicos: IReportesEconomicos[] = [{montoTransacciones:valorTransacciones, montoCompras:valorCompras, utilidad:valorUtilidad}];

      this.dsReporteEconomico = new MatTableDataSource(arregloReportesEconomicos);

    },
    (error) =>{
      console.log("hubo un problema: ",error)
    }
  );
  }


  ngOnInit() {

  }

  }


  @Component({
  selector: 'bottomSheetHerramientas',
  templateUrl: 'bottomSheetHerramientas.html',
  })
  export class BottomSheetHerramientas {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetHerramientas>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  }
