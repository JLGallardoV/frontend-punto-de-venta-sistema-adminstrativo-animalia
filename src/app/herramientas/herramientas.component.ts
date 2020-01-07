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

  /*if resumido (terneario); si el indice de inicio excede la logitud de la lista (6 - 5 de 6 por ejemplo) se veria: 6 - 10 de 6 gracias al
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
@Component({
  selector: 'app-accesos',
  templateUrl: '../accesos/accesos.component.html',
  styleUrls: ['../accesos/accesos.component.scss']
})

export class HerramientasComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmFiltrado: FormGroup;
  public frmViabilidadProductos: FormGroup;
  public frmRendimientoVendedores: FormGroup;
  public formValid: Boolean = false;
  public fechaMinimaFormateadaUtilidad: any;
  public fechaMinimaFormateadaProductos: any;
  public fechaMinimaFormateadaVendedores: any;

  //propiedades de la table
  displayedColumns: string[] = ['montoTransacciones', 'montoCompras', 'utilidad'];
  displayedColumnsMP: string[] = ['nombreProducto', 'vendidos'];
  displayedColumnsRV: string[] = ['nombreVendedor', 'vendidos'];
  dsReporteEconomico: MatTableDataSource<IReportesEconomicos>;
  dsViabilidadProductos: MatTableDataSource<IViabilidadProductos>;
  dsRendimientoVendedores: MatTableDataSource<IRendimientoVendedores>;

  @ViewChild('MatPaginatorReporteEconomico', { static: true }) MatPaginatorReporteEconomico: MatPaginator;
  @ViewChild('MatPaginatorVentasProducto', { static: true }) MatPaginatorVentasProducto: MatPaginator;
  @ViewChild('MatPaginatorVentasVendedores', { static: true }) MatPaginatorVentasVendedores: MatPaginator;

  constructor(public guardian: LoginJwtService, private modalService: NgbModal, public formBuilder: FormBuilder, public API: APIService, public formateandoFecha: DateFormatService) {
    /*tab utilidad*/
    this.frmFiltrado = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

    /*tab venta productos*/
    this.frmViabilidadProductos = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

    /*tab ventas vendedores*/
    this.frmRendimientoVendedores = this.formBuilder.group({
      fechaInicio: ["", Validators.required],
      fechaFinal: ["", Validators.required]
    });

    this.fechaMinimaFormateadaUtilidad = "";
    this.fechaMinimaFormateadaProductos = "";
    this.fechaMinimaFormateadaVendedores = "";
    this.frmFiltrado.get('fechaFinal').disable();
    this.frmViabilidadProductos.get('fechaFinal').disable();
    this.frmRendimientoVendedores.get('fechaFinal').disable();
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.titulo = "Agregar Proveedor";
  }

  //MOSTRAR UTILIDAD
  public generarUtilidad() {
    let fechaInicioForm: string = "";
    let fechaFinalForm: string = "";
    fechaInicioForm = this.frmFiltrado.get('fechaInicio').value;
    console.log("fecha de inicio: ", fechaInicioForm)

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
        document.getElementById('tablaVentaConcluidaVaciaUtilidad').style.display = "none";

        if(!this.dsReporteEconomico.paginator){
            this.dsReporteEconomico.paginator = this.MatPaginatorReporteEconomico;
            this.dsReporteEconomico.paginator._intl.itemsPerPageLabel = 'items por pagina';
            this.dsReporteEconomico.paginator._intl.getRangeLabel = etiquetaRango;
        }

      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }

  //MOSTRAR VENTAS DE PRODUCTOS
  public mostrarVentasProductos() {
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
          if (!this.dsViabilidadProductos.paginator) {
            this.dsViabilidadProductos.paginator = this.MatPaginatorVentasProducto;
            document.getElementById('tablaVentaConcluidaVaciaProductos').style.display = "none";


          }
        } else {
          alert("Al parecer no hay registros en estas fechas")
        }
      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }


  //MOSTRAR VENTAS VENDEDORES
  public mostrarVentasVendedores() {
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
          if (!this.dsRendimientoVendedores.paginator) {
            this.dsRendimientoVendedores.paginator = this.MatPaginatorVentasVendedores;
            document.getElementById('tablaVentaConcluidaVaciaVendedores').style.display = "none";

          }
        } else {
          alert("Al parecer no hay registro en estas fechas.")
        }


      },
      (error) => {
        console.log("hubo un problema: ", error)
      }
    );
  }


  //VALIDACION MIN DE INPUTS DE FILTRADO: TAB UTILIDAD
  public validarInputsFechaUtilidad(event: any) {
    let fechaMinima: string = "";
    this.fechaMinimaFormateadaUtilidad = new Date();
    fechaMinima = this.frmFiltrado.get('fechaInicio').value;
    let fechaMinimaFormateadaServicio = this.formateandoFecha.formatearFecha(fechaMinima);
    let fechaMinimaFormateadaSplit = fechaMinimaFormateadaServicio.split('-')//viene el el formato 0000-00-00 separo los elementos para pasarlos a la clase date

    /*raramente no me respeta el min (permite un dia antes del min) si unicamente lo paso con el formato de la fecha formateada, de esta manera si respeta el min,
    pd: el objeto date empieza el mes de 0 a 11*/
    this.fechaMinimaFormateadaUtilidad = new Date(parseInt(fechaMinimaFormateadaSplit[0]), parseInt(fechaMinimaFormateadaSplit[1]) - 1, parseInt(fechaMinimaFormateadaSplit[2]));
    this.frmFiltrado.get('fechaFinal').enable();
    console.log("esta es la fecha recibida: ",fechaMinima)

  }


  //VALIDACION MIN DE INPUTS DE FILTRADO: TAB PRODUCTOS
  public validarInputsFechaProductos(event: any) {
    let fechaMinima: string = "";
    this.fechaMinimaFormateadaProductos = new Date();
    fechaMinima = this.frmViabilidadProductos.get('fechaInicio').value;
    let fechaMinimaFormateadaServicio = this.formateandoFecha.formatearFecha(fechaMinima);
    let fechaMinimaFormateadaSplit = fechaMinimaFormateadaServicio.split('-')//viene el el formato 0000-00-00 separo los elementos para pasarlos a la clase date

    /*raramente no me respeta el min (permite un dia antes del min) si unicamente lo paso con el formato de la fecha formateada, de esta manera si respeta el min,
    pd: el objeto date empieza el mes de 0 a 11*/
    this.fechaMinimaFormateadaProductos = new Date(parseInt(fechaMinimaFormateadaSplit[0]), parseInt(fechaMinimaFormateadaSplit[1]) - 1, parseInt(fechaMinimaFormateadaSplit[2]));
    this.frmViabilidadProductos.get('fechaFinal').enable();

  }


  //VALIDACION MIN DE INPUTS DE FILTRADO: TAB VENDEDORES
  public validarInputsFechaVendedores(event: any) {
    let fechaMinima: string = "";
    this.fechaMinimaFormateadaVendedores = new Date();
    fechaMinima = this.frmRendimientoVendedores.get('fechaInicio').value;
    let fechaMinimaFormateadaServicio = this.formateandoFecha.formatearFecha(fechaMinima);
    let fechaMinimaFormateadaSplit = fechaMinimaFormateadaServicio.split('-')//viene el el formato 0000-00-00 separo los elementos para pasarlos a la clase date

    /*raramente no me respeta el min (permite un dia antes del min) si unicamente lo paso con el formato de la fecha formateada, de esta manera si respeta el min,
    pd: el objeto date empieza el mes de 0 a 11*/
    this.fechaMinimaFormateadaVendedores = new Date(parseInt(fechaMinimaFormateadaSplit[0]), parseInt(fechaMinimaFormateadaSplit[1]) - 1, parseInt(fechaMinimaFormateadaSplit[2]));
    this.frmRendimientoVendedores.get('fechaFinal').enable();

  }


  //EVITAMOS QUE EL USUARIO TRATE DE ESCRIBIR EN EL INPUT Y MANDE UNA FECHA NO VALIDA
  public restringirEscritura(event: any): boolean {
    /*atrapamos la tecla ingresada en este if ternario, la propiedad which contiene el unicode de la tecla presionada*/
    const charCode = (event.which) ? event.which : event.keycode; //se usa which o keycode dependiendo el soporte de nuestro browser

    /*el keycode de un caracter empiezan en 0 entonces bloqueamos todos para que no
    se pueda escribir en el input*/
    if (charCode >= 0) {
      return false;
    }
    return true;

  }

  ngOnInit() {
    this.MatPaginatorReporteEconomico._intl.itemsPerPageLabel = "items por pagina"; //inicializo los labels del paginador
    this.MatPaginatorReporteEconomico._intl.getRangeLabel = etiquetaRango; //inicializo los labels del paginador

    this.guardian.restringirAcceso();
  }
}
