import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../DataService/data.service';
import { DatabaseService, RepOut } from '../DatabaseService/database.service';


// @ts-ignore
export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot {

}

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  checkAuthentication(): boolean {
    return this.isAuthenticated.value;
  }
  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  constructor(private afAuth: AngularFireAuth, 
              private router: Router,
               private data : DataService,
              private db : DatabaseService)
   {this.exist();}
  // metodo crear cuenta con manejo de errores

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const verif = await this.signInWithEmailAndPassword(email, password);
      if (verif){
        this.isAuthenticated.next(true);
        console.log('exito');
        console.log(this.isAuthenticated.value);
        this.router.navigate(['/user']);
        return true;
      }else{
        return false;
      }
      
    } catch (error) {
      console.log("Error al iniciar sesión: ", error);
      return false;
    }
  }
  signInWithEmailAndPassword(e: string, p: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.loadRep(e).subscribe({
        next: (data: RepOut[]) => {
          const rep = data[0];
          if (rep && rep.pass == p) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error) => {
          // Manejo de errores
          console.error('Error cargando repartidores:', error);
          reject(false);
        }
      });
    });
  }
  // metodo iniciar sesión con manejo de errores
  
  async signUp(repp : RepOut): Promise<any> {
    try {
       this.db.AddRep(repp);
        return true;
    } catch (error) {
        if (error !== null && typeof error === 'object' && 'message' in error) {
            console.log("Error al registrar:", error.message);
            return error.message;
        } else {
            console.log("Error desconocido al registrar:", error);
            return "Error desconocido al intentar registrar.";
        }
    }
}
// colgarse
async signOut(): Promise<void> {
  await this.afAuth.signOut();
  this.isAuthenticated.next(false);
  const repa = ['',''];
  this.data.setItem('repa', repa);
  this.router.navigate(['/user']);
};

// no me acuerdo que hace pero si se borra no funciona
async exist() {
  try {
    const existe = await this.data.getItem('repa');
    if (existe && existe.length >= 2 && existe[0] && existe[1]) {
      console.log('Datos obtenidos del almacenamiento:', existe);
      const result = await this.signIn(existe[0], existe[1]);
      if (result) {
        console.log('Inicio de sesión exitoso');
      } else {
        console.log('Error al iniciar sesión');
      }
    } else {
      console.log('Datos de usuario inválidos o incompletos');
    }
  } catch (error) {
    console.error('Error al obtener los datos del almacenamiento:', error);
  }
}
}
