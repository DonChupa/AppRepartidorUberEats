import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
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
  
 // variables conectadas al formulario
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(){}

  // metodo llama a AuthService para registrar, luego, si es efectivo el registro, inicia sesion
  async register() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
    } else {
    try {
    const result = await this.authService.signUp(this.email, this.password);
    if (result == true) {
      this.authService.signIn(this.email, this.password);
      this.router.navigate(['/main']);
    }}
    catch (error) {
      console.log('Error durante el registro:', error);
    }
  }
}
}