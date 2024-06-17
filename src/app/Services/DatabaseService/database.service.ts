import { Injectable } from '@angular/core';
import { database } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ref, DataSnapshot, onValue, remove, push, update, get, set } from 'firebase/database';
import { DataService } from '../DataService/data.service';

const repRef = ref(database, 'Usuarios');
const repartRef = ref(database, 'Repartidores');

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
            }));
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


  UpdateRep(nombre: string, email: string, tefono: number, key: any, direccion: string, apellido:string){
    const img: string ='';
    const puntos: any ='';
    const hol: string = 'repartidor';
    const disp = 'No disponible';
    const userRef = ref(database, `Usuarios/${key}`);
    const nuevoUser: RepOut = {
      nombre: nombre,
      imagen: img,
      apellido: apellido,
      direccion: direccion,
      tipo_usuario: hol,
      telefono: tefono, 
      email: email,
      puntaje: puntos,
    };
    update(userRef, nuevoUser)
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

  
  AddRep(nombre: string, email: string, tefono: number, apellido: string) {
    const hola : string='';
    const img : string = 'https://img.freepik.com/fotos-premium/repartidor-sobre-amarillo-aislado-pulgares-arriba-porque-algo-bueno-ha-sucedido_1368-70622.jpg';
    const hol : string='repartidor';
    const punt : any = '';
    const nuevoclient: RepOut = {
      nombre: nombre,
      imagen: img,
      apellido: apellido,
      direccion: hola,
      tipo_usuario: hol,
      telefono: tefono, 
      puntaje: punt,
      email: email,
    };
    push(repRef, nuevoclient);
  }

  async AddRepart(email: string): Promise<void> {
    const newRepartRef = push(repartRef);
    const licencia : string='123';
    const disponibilidad : string='No disponible';
    const vehiculo: any = 'auto';
    const nuevorepart: RepartOut = {
      disponibilidad: disponibilidad,
      licencia_conducir: licencia,
      id_usuario: email,
      vehiculo: vehiculo,
      key: newRepartRef.key,
    };
    console.log('hey hey hey chavalines');
    return  set(newRepartRef, nuevorepart).then (() => {
      console.log(disponibilidad);
    })
    
  }
rep1 : any;
rep2 : any;



  RemoveRep(claveUnica: any) {
    remove(ref(database,`Usuarios/${claveUnica.id}`))
      .then(() => {
        console.log('Repartidor eliminado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar repartidor:', error);
      });
  }

  AllRep(): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data > 0) {
          // 
          const rep: RepOut[] = Object.keys(data)
            .map((key) => ({
              nombre: data[key].nombre,
              imagen: data[key].imagen,
              apellido: data[key].apellido,
              direccion: data[key].direccion,
              tipo_usuario: data[key].tipo_usuario,
              telefono: data[key].telefono,
              puntaje: data[key].puntaje,
              email: data[key].email,
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
  direccion: string = '';
  tipo_usuario:string = 'repartidor';
  telefono: number = 0;
  puntaje:any;
  email: string = '';
};
export class  RepartOut{
  disponibilidad: string = 'No disponible';
  id_usuario:any;
  licencia_conducir: string = '';
  vehiculo: string = '';
  key : any;
};
export class repartFull{
  nombre: string = '';
  apellido: string = '';
  imagen: string = '';
  direccion: string = '';
  tipo_usuario:string = 'repartidor';
  telefono: number = 0;
  puntaje:any;
  email: string = '';
  disponibilidad: string = 'No disponible';
  licencia_conducir: string = '';
  vehiculo: string = '';
}