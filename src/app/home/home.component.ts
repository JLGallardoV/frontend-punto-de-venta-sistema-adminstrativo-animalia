import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /*alternativa: comparar con la db el tipo de usuario
  que se le envia si es true en caso contrarios se niega el acceso*/

  constructor(private router: Router) { }

  public irTransacciones(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    console.log("nivel actual: ",nivel);
    nivel == "gerente"?this.router.navigate(['/transacciones']):null;
  }
    public irProveedores(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/proveedores']):null;
  }
  public irClientes(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/clientes']):null;
  }
  public irProductos(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/productos']):null;
  }
  public irDevoluciones(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/devoluciones']):null;
  }
  public irCategoria(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/categorias']):null;
  }
  public irVendedores(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/vendedores']):null;
  }
  public irHerramientas(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/herramientas']):null;
  }
  public irUsuarios(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/usuarios']):null;
  }
  public irAccesos(){
    let nivel: string = "";
    nivel = localStorage.getItem('nivel');
    nivel == "gerente"?this.router.navigate(['/accesos']):null;
  }

  ngOnInit() {
  }


}
