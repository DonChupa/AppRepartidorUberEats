import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/DataService/data.service';
import { DatabaseService } from 'src/app/Services/DatabaseService/database.service';
import { RepartOut } from 'src/app/Services/DatabaseService/database.service';
@Component({
  selector: 'app-repa-data',
  templateUrl: './repa-data.component.html',
  styleUrls: ['./repa-data.component.scss'],
})
export class RepaDataComponent  implements OnInit {
  a : any;
  errorMessage = '';
  content: boolean = false;
  datta : any;
  repart : RepartOut = {
    id_usuario : '',
    disponibilidad: '',
    licencia_conducir: '',
    vehiculo: '',
     key: '',
  };
  constructor(private data: DataService, private db: DatabaseService) { }

  async ngOnInit() {
 this.verContent();
 this.a = await this.data.getItem('repa');
  }

  olas(){
    console.log('olas');
    this.db.AddRepart(this.a[0],this.repart);
  }
  async verContent(){
    let user = await this.data.getItem('repa');
    this.datta = await this.db.LoadRepart(user[0]);
    this.datta.subscribe(
          (dattta: RepartOut[])  =>{
            this.repart = dattta[0];
            if (this.repart.id_usuario.length > 0){
              console.log('hay datos');
            }else{
              console.log('no hay datos');
              this.content = true;
            }
          }
        );
      }
  }
