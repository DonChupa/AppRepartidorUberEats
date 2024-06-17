import { Component, OnInit } from '@angular/core';
import { DatabaseService, RepOut, RepartOut } from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';
import { Observable, EMPTY } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  repartidor$ : Observable<RepOut[]> = EMPTY;
  repartidor2$:  Observable<RepartOut[]> = EMPTY;
  cond : boolean = true;
  constructor(private db : DatabaseService, private data : DataService) { }
  
  async ngOnInit() {
    
    const a =  await this.data.getItem('repa');
    this.repartidor$ =  this.db.loadRep(a[0]);
    this.repartidor2$ = this.db.LoadRepart(a[0]);
  }
  async SetMode(){
    this.cond = !this.cond;
    if (this.cond){
      this.db.RepState(this.repartidor2$, 'Disponible');
    }else{
      this.db.RepState(this.repartidor2$, 'No disponible');
    }
  }
}
