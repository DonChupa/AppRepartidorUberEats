import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataService } from 'src/app/Services/DataService/data.service';
import { DatabaseService } from 'src/app/Services/DatabaseService/database.service';
import { RepartOut } from 'src/app/Services/DatabaseService/database.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-repa-data',
  templateUrl: './repa-data.component.html',
  styleUrls: ['./repa-data.component.scss'],
})
export class RepaDataComponent implements OnInit, AfterViewInit {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() destinationLat: number = 40.748817; // Ejemplo: Coordenadas del Empire State Building
  @Input() destinationLng: number = -73.985428;

  // formulario
  a: any;
  errorMessage = '';
  content: boolean = false;
  datta: any;
  repart: RepartOut = {
    id_usuario: '',
    disponibilidad: '',
    licencia_conducir: '',
    vehiculo: '',
    key: '',
  };

  private map!: L.Map;

  constructor(private data: DataService, private db: DatabaseService) {}

  async ngOnInit() {
    this.verContent();
    this.a = await this.data.getItem('repa');
  }

  async ngAfterViewInit() {
    await this.getCurrentPosition();
    this.initMap();
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude], // Centro del mapa
      zoom: 15, // Nivel de zoom (ajusta según sea necesario)
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Añadir círculo en la ubicación del usuario
    L.circle([this.latitude, this.longitude], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 100 // Ajusta el radio según tus necesidades
    }).addTo(this.map);

    // Añadir marcador en el destino
    L.marker([this.destinationLat, this.destinationLng]).addTo(this.map);

    // Trazar línea desde la ubicación del usuario hasta el destino
    const latlngs: L.LatLngExpression[] = [
      [this.latitude, this.longitude],
      [this.destinationLat, this.destinationLng]
    ];

    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);

    // Ajustar la vista del mapa para que incluya ambos puntos
    this.map.fitBounds(polyline.getBounds());
  }

  olas() {
    console.log('olas');
    this.db.AddRepart(this.a[0], this.repart);
  }

  async verContent() {
    let user = await this.data.getItem('repa');
    this.datta = await this.db.LoadRepart(user[0]);
    this.datta.subscribe(
      (dattta: RepartOut[]) => {
        this.repart = dattta[0];
        if (this.repart.id_usuario.length > 0) {
          console.log('hay datos');
        } else {
          console.log('no hay datos');
          this.content = true;
        }
      }
    );
  }
}
