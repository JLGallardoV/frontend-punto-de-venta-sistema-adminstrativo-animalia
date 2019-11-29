import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReportesEconomicos, IViabilidadProductos, IRendimientoVendedores, APIService } from '../api.service';
import { DateFormatService } from '../date-format.service';
import { LoginJwtService } from '../login-jwt.service';

/*ESTA FUNCION UNICAMENTE ES PARA CAMBIAR EL "OF" DEL PAGINADOR A "DE" Y NO SE VEA FEO MEZCLADO EL ESPAÑOL CON INGLES,
ESTAMOS CONFIGURANDO LOS RANGOS DEL PAGINADOR - CORTESÍA: https://stackblitz.com/edit/angular-5mgfxh-6mbpdq */

const etiquetaRango = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { //caso paginador vacio
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);

  const startIndex = page * pageSize; //indice de inicio

/*if resumido; si el indice de inicio excede la logitud de la lista (6 - 5 de 6 por ejemplo) se veria: 6 - 10 de 6 gracias al
[pageSizeOptions] lo cual es incorrecto pues solo hay 6 elementos en tal rango ENTONCES mejor coloca como indice final el indice inicial
quedaria 6 - 6 de 6 que es lo correcto).*/
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}


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
  public frmViabilidadProductos: FormGroup;
  public frmRendimientoVendedores: FormGroup;
  public formValid: Boolean = false;
  //propiedades de la table
  displayedColumns: string[] = ['montoTransacciones', 'montoCompras', 'utilidad'];
  displayedColumnsMP: string[] = ['nombreProducto', 'vendidos'];
  displayedColumnsRV: string[] = ['nombreVendedor', 'vendidos'];
  dsReporteEconomico: MatTableDataSource<IReportesEconomicos>;
  dsViabilidadProductos: MatTableDataSource<IViabilidadProductos>;
  dsRendimientoVendedores: MatTableDataSource<IRendimientoVendedores>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public guardian: LoginJwtService, private modalService: NgbModal, public formBuilder: FormBuilder, public API: APIService, public formateandoFecha: DateFormatService) {
    this.frmFiltrado = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

    this.frmViabilidadProductos = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

    this.frmRendimientoVendedores = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.titulo = "Agregar Proveedor";
  }

  //MOSTRAR REPORTES ECONOMICOS
  public generarReportes() {
    let fechaInicioForm: string = "";
    let fechaFinalForm: string = "";
    fechaInicioForm = this.frmFiltrado.get('fechaInicio').value;
    fechaFinalForm = this.frmFiltrado.get('fechaFinal').value;
    let fechaInicioFormateada = this.formateandoFecha.formatearFecha(fechaInicioForm);
    let fechaFinalFormateada = this.formateandoFecha.formatearFecha(fechaFinalForm);

    this.API.mostrarReporte(fechaInicioFormateada, fechaFinalFormateada).subscribe(
      (success: any) => {
        //los valores vienen en matriz como estructura
        let valorTransacciones = success.respuesta[0][0].montoTransacciones;
        let valorCompras = success.respuesta[1][0].montoCompras;
        let valorUtilidad = success.respuesta[2][0].utilidad;

        let arregloReportesEconomicos: IReportesEconomicos[] = [{ montoTransacciones: valorTransacciones, montoCompras: valorCompras, utilidad: valorUtilidad }];

        this.dsReporteEconomico = new MatTableDataSource(arregloReportesEconomicos);
        if(!this.dsReporteEconomico.paginator){
          this.dsReporteEconomico.paginator = this.paginator;
          this.dsReporteEconomico.paginator._intl.itemsPerPageLabel = 'items por pagina';
          this.dsReporteEconomico.paginator._intl.getRangeLabel = etiquetaRango;

        }

      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }

  //MOSTRAR VIABILIDAD DE PRODUCTOS
  public generarViabilidad() {
    let fechaInicioForm: string = "";
    let fechaFinalForm: string = "";
    fechaInicioForm = this.frmViabilidadProductos.get('fechaInicio').value;
    fechaFinalForm = this.frmViabilidadProductos.get('fechaFinal').value;
    let fechaInicioFormateada = this.formateandoFecha.formatearFecha(fechaInicioForm);
    let fechaFinalFormateada = this.formateandoFecha.formatearFecha(fechaFinalForm);

    this.API.mostrarViabilidadProductos(fechaInicioFormateada, fechaFinalFormateada).subscribe(
      (success: any) => {
        if (success.estatus == 1) {
          this.dsViabilidadProductos = new MatTableDataSource(success.respuesta);
        }
      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }

  //MOSTRAR RENDIMIENTO VENDEDORES
  public generarRendimientoVendedores() {
    let fechaInicioForm: string = "";
    let fechaFinalForm: string = "";
    fechaInicioForm = this.frmRendimientoVendedores.get('fechaInicio').value;
    fechaFinalForm = this.frmRendimientoVendedores.get('fechaFinal').value;
    let fechaInicioFormateada = this.formateandoFecha.formatearFecha(fechaInicioForm);
    let fechaFinalFormateada = this.formateandoFecha.formatearFecha(fechaFinalForm);

    this.API.mostrarRendimientoVendedores(fechaInicioFormateada, fechaFinalFormateada).subscribe(
      (success: any) => {
        //el ws regresa 0 en el numero de ventas en lugar de null y null el nombre del vendedor si no hay ventas por eso esta validacion.
        if (success.estatus == 1 && success.respuesta[0].nombreVendedor != null) {
          this.dsRendimientoVendedores = new MatTableDataSource(success.respuesta);
        } else {
          alert("Al parecer no hay registro en estas fechas.")
        }


      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }


  ngOnInit() {
    this.guardian.restringirAcceso();

  }

}
