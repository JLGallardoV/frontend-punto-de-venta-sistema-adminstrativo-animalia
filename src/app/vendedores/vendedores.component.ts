import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IVendedores,APIService} from '../api.service';
import {DateFormatService} from '../date-format.service';
import {LoginJwtService} from '../login-jwt.service';
import {ConfirmarEliminarService} from '../confirmar-eliminar.service';
import {GenerarPDFsService} from '../generar-pdfs.service';

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
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss']
})
export class VendedoresComponent implements OnInit {

  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmVendedores: FormGroup;
  public formValid:Boolean=false;
  public arregloDetalleVendedor: any[];
  //propiedades tabla
  displayedColumnsVendedores: string[] = ['idVendedor', 'nombreVendedor', 'ciudadVendedor', 'estadoVendedor', 'telefonoVendedor', 'acciones'];
  dsVendedores:MatTableDataSource<IVendedores>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public guardian:LoginJwtService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public API:APIService,
    public formateandoFecha:DateFormatService,
    public eliminacionSegura: ConfirmarEliminarService,
    public PDF: GenerarPDFsService

) {
    this.frmVendedores = this.formBuilder.group({
      idVendedor:[""],
      nombreVendedor:["",Validators.required],
      ciudadVendedor:["",Validators.required],
      estadoVendedor:["",Validators.required],
      direccionVendedor:["",Validators.required],
      telefonoVendedor:["",Validators.required],
      emailVendedor:["",Validators.required],
      fechaNacimientoVendedor:["",Validators.required],
      rfcVendedor:["",Validators.required],
      numeroSeguroSocialVendedor:["",Validators.required],
      antiguedadVendedor:["",Validators.required]
    });
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {size:'lg'});
    this.titulo = "Agregar Vendedor";
  }

  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content,idVendedor:number,nombreVendedor: string, ciudadVendedor: string, estadoVendedor: string, direccionVendedor: string, telefonoVendedor: string, emailVendedor: string, fechaNacimientoVendedor: string, rfcVendedor: string, numeroSeguroSocialVendedor: number, antiguedadVendedor: number){
    console.log("id: ",idVendedor," nombre: ",nombreVendedor," ciudad: ",ciudadVendedor," email: ",emailVendedor);
    this.modal= this.modalService.open(content, {size:'lg'});
    this.titulo = "Editar Vendedor";
    //pintando los valores en el modal listos para editarlos
    this.frmVendedores.controls['idVendedor'].setValue(idVendedor); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmVendedores.controls['nombreVendedor'].setValue(nombreVendedor);
    this.frmVendedores.controls['ciudadVendedor'].setValue(ciudadVendedor);
    this.frmVendedores.controls['estadoVendedor'].setValue(estadoVendedor);
    this.frmVendedores.controls['direccionVendedor'].setValue(direccionVendedor);
    this.frmVendedores.controls['telefonoVendedor'].setValue(telefonoVendedor);
    this.frmVendedores.controls['emailVendedor'].setValue(emailVendedor);
    this.frmVendedores.controls['fechaNacimientoVendedor'].setValue(fechaNacimientoVendedor);
    this.frmVendedores.controls['rfcVendedor'].setValue(rfcVendedor);
    this.frmVendedores.controls['numeroSeguroSocialVendedor'].setValue(numeroSeguroSocialVendedor);
    this.frmVendedores.controls['antiguedadVendedor'].setValue(antiguedadVendedor);
  }
  //FUNCION PARA ABRIR EL MODAL DE INFORMACION VENDEDOR, CONFIGURACIONES DE BOOTSTRAP
  public openScrollableContentVendedor(longContentVendedor:any, idVendedor:number) {
    this.modalService.open(longContentVendedor, {scrollable: true });
    this.listarDetalleVendedor(idVendedor);
  }


  //LISTAR VENDEDORES
  public listarVendedores(){
    this.API.mostrarVendedores().subscribe(
      (success:any)=>{
        this.dsVendedores = new MatTableDataSource(success.respuesta);
        this.dsVendedores.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "items por pagina";
        this.paginator._intl.getRangeLabel = etiquetaRango;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }
  //LISTAR DETALLES CLIENTES
  public listarDetalleVendedor(idCliente:number){
    this.API.mostrarDetalleVendedor(idCliente).subscribe(
      (success:any)=>{
        this.arregloDetalleVendedor = success.respuesta;
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  //AGREGAR VENDEDOR Y ACTUALIZAR VENDEDOR: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){
    let idVendedorForm = this.frmVendedores.get('idVendedor').value;
    let nombreVendedorForm = this.frmVendedores.get('nombreVendedor').value;
    let ciudadVendedorForm = this.frmVendedores.get('ciudadVendedor').value;
    let estadoVendedorForm = this.frmVendedores.get('estadoVendedor').value;
    let direccionVendedorForm = this.frmVendedores.get('direccionVendedor').value;
    let telefonoVendedorForm = this.frmVendedores.get('telefonoVendedor').value;
    let emailVendedorForm = this.frmVendedores.get('emailVendedor').value;
    let fechaNacimientoVendedorForm = this.frmVendedores.get('fechaNacimientoVendedor').value;
    let rfcVendedorForm = this.frmVendedores.get('rfcVendedor').value;
    let numeroSeguroSocialVendedorForm = this.frmVendedores.get('numeroSeguroSocialVendedor').value;
    let antiguedadVendedorForm = this.frmVendedores.get('antiguedadVendedor').value;


    //formateo fecha para que sea compaible con el sgbd:
    let fechaNacimientoVendedorFormateada = this.formateandoFecha.formatearFecha(fechaNacimientoVendedorForm);
    if (this.titulo == "Agregar Vendedor") {
      this.API.aniadirVendedor(nombreVendedorForm,ciudadVendedorForm,estadoVendedorForm,direccionVendedorForm,telefonoVendedorForm,emailVendedorForm,fechaNacimientoVendedorFormateada,rfcVendedorForm,numeroSeguroSocialVendedorForm,antiguedadVendedorForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarVendedores();
          this.frmVendedores.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Vendedor"){
      this.API.actualizarVendedor(idVendedorForm,nombreVendedorForm,ciudadVendedorForm,estadoVendedorForm,direccionVendedorForm,telefonoVendedorForm,emailVendedorForm,fechaNacimientoVendedorFormateada,rfcVendedorForm,numeroSeguroSocialVendedorForm,antiguedadVendedorForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarVendedores();
          this.frmVendedores.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }

  //ELIMINAR VENDEDOR
  public eliminarVendedor(idVendedor:number){
    let respuesta: boolean = false;
    respuesta = this.eliminacionSegura.confirmarEliminacion();

    if (respuesta == true) {
      this.API.borrarVendedor(idVendedor).subscribe(
        (success:any)=>{
          alert(success.respuesta);
          this.listarVendedores();

        },
        (error)=>{
          console.log("hubo un problema: ", error);
        }
      );
    } else {
      console.log("eliminacion cancelada");
    }
  }

  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsVendedores.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsVendedores.paginator ? this.dsVendedores.paginator.firstPage(): null;
  }


  //INVOCANDO SERVICIO PARA GENERAR PDF
  public generarPDF(etiquetaPDF:string){
    this.PDF.generarPDF(etiquetaPDF);
  }

  ngOnInit() {
    this.listarVendedores();

  }

}
