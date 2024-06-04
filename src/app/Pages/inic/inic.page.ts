import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inic',
  templateUrl: './inic.page.html',
  styleUrls: ['./inic.page.scss'],
})
export class InicPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  InicSes(){
    this.router.navigate(['login']);
  }

}
