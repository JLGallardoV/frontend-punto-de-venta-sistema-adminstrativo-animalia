import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap'; //LIBRERIA BOOTSTRAP
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import {IUsuarios,ITiposDeUsuarios,IVendedores,APIService} from '../api.service';
import {LoginJwtService} from '../login-jwt.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  public closeResult: string; //modal
  public modal: NgbModalRef; //modal
  public titulo = ""; //para el modal
  public frmUsuarios: FormGroup;
  public formValid:Boolean=false;
  public arregloTiposDeUsuarios:ITiposDeUsuarios[];
  public arregloVendedores:IVendedores[];
  displayedColumns: string[] = ['idUsuario','nombreUsuario','emailUsuario','idTipoUsuario','acciones'];
  dsUsuarios:MatTableDataSource<IUsuarios>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public guardian:LoginJwtService,private _bottomSheet: MatBottomSheet, private modalService: NgbModal, public formBuilder: FormBuilder,public API:APIService) {
    this.frmUsuarios = this.formBuilder.group({
      idUsuario:[""],
      nombreUsuario:["",Validators.required],
      emailUsuario:["",Validators.required],
      contraseniaUsuario:["",Validators.required],
      idVendedor:["",Validators.required],
      idTipoUsuario:["",Validators.required]
    });
  }

  //MENU INFERIOR BOTTOM SHEET
  public openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetUsuarios);
  }

  //FUNCION PARA ABRIR EL MODAL, CONFIGURACIONES DE BOOTSTRAP
  public openAlta(content) {
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Agregar Usuario";
  }//------fin open--------------------------------------------------
  //ABRIR MODAL CON LOS DATOS A EDITAR
  public openEditar(content,idUsuario:number,nombreUsuario:string,emailUsuario:string,idVendedor:number,idTipoUsuario:number){
    console.log("id: ",idUsuario," nombre: ",nombreUsuario," email: ",emailUsuario," tipo: ",idTipoUsuario);
    this.modal= this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.titulo = "Editar Usuario";
    //pintando los valores en el modal listos para editarlos
    this.frmUsuarios.controls['idUsuario'].setValue(idUsuario); // si checamos el DOM veremos que el input es hide para evitar su modificacion posteriormente
    this.frmUsuarios.controls['nombreUsuario'].setValue(nombreUsuario);
    this.frmUsuarios.controls['emailUsuario'].setValue(emailUsuario);
    this.frmUsuarios.controls['idVendedor'].setValue(idVendedor);
    this.frmUsuarios.controls['idTipoUsuario'].setValue(idTipoUsuario);
  }


  //LISTAR USUARIOS
  public listarUsuarios(){
    this.API.mostrarUsuarios().subscribe(
      (success:any)=>{
        this.dsUsuarios = new MatTableDataSource(success.respuesta);
        this.dsUsuarios.paginator = this.paginator;
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //LISTAR USUARIOS PARA EL SELECT DEL FORMULARIO
  public listarTiposDeUsuarios(){
    this.API.mostrarTiposDeUsuarios().subscribe(
      (success: any)=>{
        this.arregloTiposDeUsuarios = success.respuesta;
        console.log("listando tipos de usuarios")
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //LISTAR VENDEDORES PARA EL SELECT DEL FORMULARIO
  public listarVendedores(){
    this.API.mostrarVendedores().subscribe(
      (success: any)=>{
        this.arregloVendedores = success.respuesta;
        console.log("listando vendedores")
      },
      (error)=>{
        console.log("hubo un problema: ",error)
      }
    );
  }

  //AGREGAR USUARIO Y ACTUALIZAR USUARIO: EVITO CREAR 2 MODALES
  public ejecutarPeticion(){

    let idUsuarioForm = this.frmUsuarios.get('idUsuario').value;
    let nombreUsuarioForm = this.frmUsuarios.get('nombreUsuario').value;
    let emailUsuarioForm = this.frmUsuarios.get('emailUsuario').value;
    let contraseniaUsuarioForm = this.frmUsuarios.get('contraseniaUsuario').value;
    let idVendedorForm = this.frmUsuarios.get('idVendedor').value;
    let idTipoUsuarioForm = this.frmUsuarios.get('idTipoUsuario').value;

    if (this.titulo == "Agregar Usuario") {
      this.API.aniadirUsuario(nombreUsuarioForm,emailUsuarioForm,contraseniaUsuarioForm,idVendedorForm,idTipoUsuarioForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarUsuarios();
          this.frmUsuarios.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
    if(this.titulo == "Editar Usuario"){
      this.API.actualizarUsuario(idUsuarioForm,nombreUsuarioForm,emailUsuarioForm,contraseniaUsuarioForm,idVendedorForm,idTipoUsuarioForm).subscribe(
        (success: any)=>{
          alert(JSON.stringify(success.respuesta));
          this.listarUsuarios();
          this.frmUsuarios.reset();
          this.modal.close();

        },
        (error)=>{
          console.log("hubo un problema: ",error)
        }
      );
    }
  }

  //ELIMINAR CLIENTE
  public eliminarUsuario(idUsuario:number){
    this.API.borrarUsuario(idUsuario).subscribe(
      (success:any)=>{
        alert(success.respuesta);
        this.listarUsuarios();

      },
      (error)=>{
        console.log("hubo un problema: ", error);
      }
    );
  }

  //FUNCIONALIDAD FILTRAR
  public filtrarRegistros(filterValue: string) {
    this.dsUsuarios.filter = filterValue.trim().toLowerCase();
    //si se usa el modulo tab de transacciones, entonces arroja los resultados buscados en la primer pagina: (if reducido)
    this.dsUsuarios.paginator ? this.dsUsuarios.paginator.firstPage(): null;
  }
  ngOnInit() {
    this.guardian.restringirAcceso();
    this.listarUsuarios();
    this.listarTiposDeUsuarios();
    this.listarVendedores();
  }

  }




















@Component({
  selector:  'bottomSheetUsuarios',
  templateUrl: 'bottomSheetUsuarios.html',
})
export class BottomSheetUsuarios {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetUsuarios>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
