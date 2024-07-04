import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { DatabaseService, RepOut, RepartOut } from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';
import { Observable, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/Services/AuthService/auth.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent  implements OnInit {
  @ViewChild('Modal') modal: IonModal | any;

  repp : RepOut = {
    nombre : '',
    imagen: '',
    direccion: '',
    apellido: '',
    tipo_usuario: 'repartidor',
    telefono: 0,
    puntaje: 0,
    email: '',
    key:'',
  };
 reppa: RepartOut = {
  disponibilidad: '',
  id_usuario: '',
  licencia_conducir: '',
  vehiculo: '',
  key: '',
 }
 


  repartidor$ : Observable<RepOut[]> = EMPTY;
  repartidor2$:  Observable<RepartOut[]> = EMPTY;
  cond : boolean = true;
  constructor(private db : DatabaseService, private data : DataService, private auth : AuthService) { }
  user : any;
  async ngOnInit() {
    
    this.user =  await this.data.getItem('repa');
    this.repartidor$ =  this.db.loadRep(this.user[0]);
    this.repartidor2$ = this.db.LoadRepart(this.user[0]);
  }
  async SetMode(){
    this.cond = !this.cond;
    if (this.cond){
      this.db.RepState(this.repartidor2$, 'Disponible');
    }else{
      this.db.RepState(this.repartidor2$, 'No disponible');
    }
  }
  openModal(r : RepOut, rep :RepartOut) {
    this.repp = r;
    this.reppa = rep;
    console.log(this.reppa);
    if(this.modal){
      this.modal.present();}
  }
  closeModal() {
    this.modal.dismiss();
  }
  async update(){
    this.db.UpdateRep(this.repp);
    this.db.UpdateRepart(this.reppa);
    this.closeModal();
  }
  Out(){
    this.auth.signOut();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.repp.imagen = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
}
