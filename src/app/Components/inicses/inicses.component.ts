import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { Router } from '@angular/router';

import { getDatabase, ref} from 'firebase/database';
import { database } from 'src/environments/environment';
import { DataService } from 'src/app/Services/DataService/data.service';
import { DatabaseService,RepOut } from 'src/app/Services/DatabaseService/database.service';
import { Observable,Subscription } from 'rxjs';



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
  rep$: Observable<RepOut[]> |undefined;

  constructor(private authService: AuthService, private router:Router, private data:DataService, private db: DatabaseService) {}


  //metodo llama a authService para iniciar sesion
  async Login() {
    this.rep$ =  this.db.loadRep(this.email);
    this.rep$.subscribe({
      next: async (repas: RepOut[]) => {
        if (repas.length > 0) {
          const rep = repas[0];
          if (rep.tipo_usuario === 'repartidor') {
            const resultado = await this.authService.signIn(this.email, this.password);
            if (resultado !== true) {
              this.errorMessage = 'Error con usuario o contraseña, intente nuevamente';
              return;
            }
          else{
            const repa = [this.email, this.password];
            this.data.setItem('repa', repa);
            const a = await this.data.getItem('repa');
            this.router.navigate(['/main']);
          }
        }}
            else{
              this.errorMessage = 'usuario no existe';
            }
          }})
    }
  async ngOnInit() {
    await this.data.set('name', 'Ionic');
  }

}