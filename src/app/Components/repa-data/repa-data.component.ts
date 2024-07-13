import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataService } from 'src/app/Services/DataService/data.service';
import { DatabaseService, RepOut} from 'src/app/Services/DatabaseService/database.service';
import { RepartOut } from 'src/app/Services/DatabaseService/database.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-repa-data',
  templateUrl: './repa-data.component.html',
  styleUrls: ['./repa-data.component.scss'],
})
export class RepaDataComponent implements OnInit, AfterViewInit {
  latitude!: number;
  longitude!: number;
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
  repp : RepOut = {
    nombre : '',
    imagen: '',
    direccion: '',
    apellido: '',
    tipo_usuario: 'repartidor',
    telefono: 0,
    puntaje: 0,
    email: '',
    key:'',
    pass: '',
  };
content2: boolean | any;

  private map!: L.Map;
  private updateInterval: any;

  constructor(private data: DataService, private db: DatabaseService) {}

  async ngOnInit() {
    this.verContent();
    this.a = await this.data.getItem('repa');
    this.db.loadRep(this.a[0]).subscribe(
      data => {
        this.repp = data[0];
        this.disp(this.repart.disponibilidad);
      }
    );
    console.log(this.repp);
     this.db.LoadRepart(this.a).subscribe(
      data => {
        this.repart = data[0];
      }
    )
  }

  disp (c : string){
    if (c == 'Disponible'){
      this.content2=  true;
    }else{
      this.content2= false;
    }

  }

  async ngAfterViewInit() {
    await this.getCurrentPosition();

    this.initMap();
    this.updateInterval = setInterval(async () => {
      await this.getCurrentPosition();
      // Actualizar el mapa con la nueva posición
      this.updateMap();
    }, 1000);
  }

  private updateMap(): void {
    // Centrar el mapa en la nueva posición del usuario
    this.getCurrentPosition();
    this.map.setView([this.repp.direccion[0],this.repp.direccion[1]], this.map.getZoom());
  
    // Limpiar y volver a dibujar el círculo en la nueva ubicación
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Circle) {
        layer.remove();
      }
    });
  
    L.circle([this.repp.direccion[0],this.repp.direccion[1]], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 1 // Ajusta el radio según tus necesidades
    }).addTo(this.map);
  }
  
  // Asegúrate de limpiar el intervalo cuando el componente se destruya
  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  async getCurrentPosition() {
    try {
      // Obtener las coordenadas actuales
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 999999999999999
      });
  
      // Asignar las coordenadas a las propiedades latitude y longitude
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
  
      // Asegurarse de que this.repp esté inicializado antes de modificarlo
      if (this.repp) {
        // Asignar la dirección al objeto this.repp
        this.repp.direccion = [this.latitude, this.longitude];
  
        // Actualizar el repartidor en la base de datos
        this.db.UpdateRep(this.repp);
  
        // Mostrar las coordenadas en la consola
        
      } else {
        console.error('this.repp no está inicializado');
      }
    } catch (error) {
      console.error('Error al obtener la posición actual:', error);
    }
  }

  private initMap(): void {
    this.getCurrentPosition();
    this.map = L.map('map', {
      center: [this.repp.direccion[0],this.repp.direccion[1]], // Centro del mapa
      zoom: 20, // Nivel de zoom (ajusta según sea necesario)
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    // Añadir círculo en la ubicación del usuario
    L.circle([this.latitude, this.longitude], {
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: 1 // Ajusta el radio según tus necesidades
    }).addTo(this.map);
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
