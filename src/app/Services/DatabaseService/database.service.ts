import { Injectable } from '@angular/core';
import { database } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ref, DataSnapshot, onValue, remove, push, update, get, set } from 'firebase/database';

const prodRef = ref(database, 'Productos');
const restRef = ref(database, 'Restaurante');
const repRef = ref(database, 'Usuarios');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  loadRep(email: string): Observable<RepOut[]> {
    return new Observable<RepOut[]>((subscriber) => {
      const unsubscribe = onValue(repRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          // 
          const rep: RepOut[] = Object.keys(data)
            .filter((key) => data[key].email === email )
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

  AddRep(nombre: string, email: string, tefono: number, apellido: string) {
    const hola : string='';
    const img : string = '';
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