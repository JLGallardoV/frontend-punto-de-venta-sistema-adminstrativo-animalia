import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReportesEconomicos, IViabilidadProductos, IRendimientoVendedores, APIService } from '../api.service';
import { DateFormatService } from '../date-format.service';
import { LoginJwtService } from '../login-jwt.service';

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
        if (success.respuesta == 1) {
          this.dsViabilidadProductos = new MatTableDataSource(success.respuesta);
        }
        alert(JSON.stringify(success.respuesta));

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
