import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { Router } from '@angular/router';

import { getDatabase, ref} from 'firebase/database';
import { firebaseApp } from 'src/environments/environment';
import { DataService } from 'src/app/Services/DataService/data.service';


const database = getDatabase(firebaseApp);

@Component({
  selector: 'app-inicses',
  templateUrl: './inicses.component.html',
  styleUrls: ['./inicses.component.scss'],
})
export class InicsesComponent  implements OnInit {
  // variables conectadas al formulario
  password: string = '';
  errorMessage: string = '';
  email: string = '';

  constructor(private authService: AuthService, private router:Router, private data:DataService) {}


  //metodo llama a authService para iniciar sesion
  async Login() {
    const result = await this.authService.signIn(this.email, this.password);
    if (result!== true){
      this.errorMessage = 'error con usuario o contraseña, intente nuevamente';
    } else {
      console.log(this.authService.checkAuthentication())
      const usuario = [this.email, this.password];
      this.data.setItem('user', usuario);
      const a = await this.data.getItem('user');
      console.log(a)
      this.router.navigate(['/main']);

    }
  } 
  async ngOnInit() {
    await this.data.set('name', 'Ionic');
  }

}