import { Injectable } from '@angular/core';
import { database } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ref, DataSnapshot, onValue, remove, push, update, get, set } from 'firebase/database';
import { DataService } from '../DataService/data.service';

const repRef = ref(database, 'Usuarios');
const repartRef = ref(database, 'Repartidores');
const histRef = ref(database, 'Entrega');
const pefRef = ref(database, 'Historial');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private data: DataService) { }

  loadRep(email: string): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          // 
          const rep: RepOut[] = Object.keys(data)
            .filter((key) => data[key].email == email )
            .map((key) => ({
              nombre: data[key].nombre,
              imagen: data[key].imagen,
              apellido: data[key].apellido,
              direccion: data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono: data[key].telefono,
              puntaje: data[key].puntaje,
              email: email,
              key: key,
              pass: data[key].pass,
            }));
            console.log();
          subscriber.next(rep);
        } else {
          console.log('error, no encontre user')
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }


  UpdateRep(user: RepOut){
    const key = user.key;
    const userRef = ref(database, `Usuarios/${key}`);
    update(userRef, user)
    .then(() => {
      console.log('listo');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  UpdateRepart(Rep: RepartOut){
    const key = Rep.key;
    const userRef = ref(database, `Repartidores/${key}`);
    update(userRef, Rep)
    .then(() => {
      console.log('listo');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  async RepState(r: Observable<RepartOut[]>, estado : string){
    r.pipe(
      take(1)
    ).subscribe(
          data =>{
            if (data){
            const rep = data[0];
            rep.disponibilidad = estado;
            const nuevorepart = {
              disponibilidad : rep.disponibilidad,
              id_usuario: rep.id_usuario,
              licencia_conducir: rep.licencia_conducir,
              vehiculo: rep.vehiculo,
              key: rep.key,
            }
            const userRef = ref(database, `Repartidores/${rep.key}`);
            update(userRef, nuevorepart)
          }else{
            console.log('no encuentro repartidor')
          }
          }
        )
  }

  LoadRepart(email: string): Observable<RepartOut[]> {
    return new Observable<RepartOut[]>((subscriber) => {
      const unsubscribe = onValue(repartRef, (snapshot: DataSnapshot) => {
        if (!snapshot.exists()) {
          console.log('No se encontraron datos en Firebase');
          subscriber.next([]);
          return;
        }
        const data = snapshot.val();
          const rep: RepartOut[] = Object.keys(data)
            .filter((key) => data[key].id_usuario == email)
            .map((key) => ({
              disponibilidad: data[key].disponibilidad,
              id_usuario: email,
              licencia_conducir: data[key].licencia_conducir,
              vehiculo: data[key].vehiculo,
              key: key,
            }));
          subscriber.next(rep);
      }, (error) => {
        console.error('Error al obtener datos de Firebase:', error);
        subscriber.error(error);
      });
  
      return () => {
        unsubscribe();
      };
    });
  }

  
  AddRep(nuevoClient : RepOut) {
    const newRef = push(repRef, nuevoClient);
    nuevoClient.key = newRef.key,
    update(ref(database, 'Usuarios/{nuevoClient.key}'),nuevoClient);
  }

  async AddRepart(email: string,nuevorepart : RepartOut): Promise<void> {
    nuevorepart.id_usuario = email;
    const newRef = push(repartRef, nuevorepart);
    nuevorepart.key = newRef.key;
    update(ref(database, 'Repart/{nuevorepart.key}'),nuevorepart);

  }

  RemoveRep(claveUnica: any) {
    remove(ref(database,`Usuarios/${claveUnica.id}`))
      .then(() => {
        console.log('Repartidor eliminado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar repartidor:', error);
      });
  }
  LoadEntregas(id: any): Observable<EntregOut[]> {
    return new Observable<EntregOut[]>((subscriber) => {
      const unsubscribe = onValue(histRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const pedids: EntregOut[] = Object.keys(data)
            .filter((key) => data[key].id_repartidor == id)
            .map((key) => ({
              id_restaurante: data[key].id_restaurante,
              direccion: data[key].direccion,
              estado:  data[key].estado,
              id_repartidor: data[key].id_repartidor,
              key: key,
              pedidos: data[key].pedidos,
              id_usuario: data[key].id_usuario,
            }));
          subscriber.next(pedids);
        } else {
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }
  removeEntrega(e : EntregOut){
    console.log(e);
    remove(ref(database,`Entrega/${e.key}`))
    .then(() => {
      console.log('Entrega Eliminada');
      this.CreateHist(e);
    })
    .catch((error) => {
      console.error('Error al eliminar:', error);
    });
}
CreateHist(e : EntregOut){
  console.log(e);
  let hist : HistoryOut = {
    id_restaurante : e.id_restaurante,
    direccion : e.direccion ,
    estado: 'Finalizado',
    repartidor : '',
    fotoRepp: '',
    key: '',
    pedidos: e.pedidos,
    id_usuario: e.id_usuario,
  }
  this.loadRep(e.id_repartidor).subscribe(
    data => {
      hist.repartidor = data[0].nombre + ' '+ data[0].apellido;
      hist.fotoRepp = data[0].imagen;
      console.log(hist);
      const newRef = push(pefRef, hist);
      const key = newRef.key;
      hist.key = key,
      update(newRef, hist);
    }
  )
}
  
  AllRep(): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data > 0) {
          const rep: RepOut[] = Object.keys(data)
          .filter( key => ( data[key].tipo_usuario = 'repartidor') )
            .map((key) => ({
              nombre: data[key].nombre,
              imagen: data[key].imagen,
              apellido: data[key].apellido,
              direccion: data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono: data[key].telefono,
              puntaje: data[key].puntaje,
              email: data[key].email,
              key: key,
              pass: data[key].pass,
            } ));
          subscriber.next(rep);
          console.log(data);
          
        } else {
          console.log('error, no encontre users')
          subscriber.next([]);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  }
  //////////////////////////////////
}
export class  RepOut{
  nombre: string = '';
  apellido: string = '';
  imagen: string = '';
  direccion: any = '';
  tipo_usuario:string = 'repartidor';
  telefono: number|any = 0;
  puntaje:any;
  email: string = '';
  key : any;
  pass: string ='';
};
export class  RepartOut{
  disponibilidad: string = 'No disponible';
  id_usuario:any;
  licencia_conducir: string = '';
  vehiculo: string = '';
  key : any;
};
export class EntregOut{
  id_restaurante: string='';
  direccion: any = [0,0];
  estado:string = '';
  id_repartidor: any;
  key: any;
  pedidos:PedidOut[] = [];
  id_usuario: any='';
};
export class PedidOut{
  cantidad: number = 1;
  estado: string = '';
  id_usuario: any;
  producto: any;
  precio: number = 0;
  key: any;
  id_rest: any;
  imagen: any;
  };
  export class HistoryOut{
    id_restaurante: string='';
    direccion: string = '';
    estado:string = '';
    repartidor: string = '';
    fotoRepp: any;
    key: any;
    pedidos:PedidOut[] = [];
    id_usuario: any='';
  };