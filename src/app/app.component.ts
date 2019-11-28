import { Component } from '@angular/core';
import {LoginJwtService} from './login-jwt.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private JWT:LoginJwtService){}
  title = 'puntoVentaMascotas';
  public openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("contenido").style.opacity = "0.4";
    document.getElementById("contenido").style.pointerEvents = "none";

  }

  public closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("contenido").style.opacity = 'initial';
    document.getElementById("contenido").style.pointerEvents = "unset";

  }
  public logout(){
    this.JWT.logout();
    this.closeNav();
  }
}
