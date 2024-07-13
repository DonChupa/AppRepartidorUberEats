import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { empty, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { DatabaseService, RepOut } from 'src/app/Services/DatabaseService/database.service';
import { DataService } from 'src/app/Services/DataService/data.service';

// @ts-ignore

export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot {
  // ...
}



@Component({
  selector: 'app-registro',
  templateUrl: './registro.Component.html',
  styleUrls: ['./registro.component.scss'],
})


export class RegistroComponent implements OnInit {
  repi :RepOut ={
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    telefono: undefined,
    imagen: '',
    tipo_usuario: 'repartidor',
    puntaje: '',
    key: '',
    pass: '',
  }
 // variables conectadas al formulario

  errorMessage: string = '';



  constructor(private authService: AuthService, private router: Router, private db : DatabaseService, private data : DataService) { }
  ngOnInit(){}

  // metodo llama a AuthService para registrar, luego, si es efectivo el registro, inicia sesion
  async register() {
    if (!this.repi.email || !this.repi.pass || !this.repi.nombre || !this.repi.apellido || !this.repi.telefono) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
    try {
    const result = await this.authService.signUp(this.repi);
    if (result == true) {
      this.authService.signIn(this.repi.email, this.repi.pass);
      const repa = [this.repi.email, this.repi.pass];
      this.data.setItem('repa', repa);
      this.db.AddRep(this.repi);
      this.router.navigate(['/repart']);
    }}
    catch (error) {
      console.log('Error durante el registro:', error);
    }
  }
}
}