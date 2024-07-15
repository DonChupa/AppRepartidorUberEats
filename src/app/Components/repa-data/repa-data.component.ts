import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DataService } from 'src/app/Services/DataService/data.service';
import { DatabaseService, EntregOut, PedidOut, RepOut} from 'src/app/Services/DatabaseService/database.service';
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
  lat2!: number;
  long2!:number;

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

  pedidos: EntregOut[] = [];
content2: boolean | any;
perso : boolean = false;
  private map!: L.Map;
  private updateInterval: any;

  constructor(private data: DataService, private db: DatabaseService) {}

  async ngOnInit() {
    this.verContent();
    this.perso = await this.data.getItem('perso');
    this.lat2 = await this.data.getItem('lat2');
    this.long2 = await this.data.getItem('long2');
    console.log(await this.data.getItem('lat2'));
    console.log(await this.data.getItem('long2'));
    this.a = await this.data.getItem('repa');
    this.db.LoadEntregas(this.a[0]).subscribe(
      (data:EntregOut[]) => {
        
        this.pedidos = data;
      }
    )
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
  async entregar(){
    this.perso = false;
    this.resetMap();
    this.initMap();
    this.data.set('perso', false);
    const entre = await this.data.getItem('entre');
    this.db.removeEntrega(entre);
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
  async MarcarRuta(lat: number, lng : number, e : EntregOut): Promise<void> {
    this.perso = true;
    this.data.setItem('entre', e);
    this.data.setItem('perso', this.perso);
    console.log(await this.data.getItem('perso'));


    this.lat2= lat;
    this.long2= lng;
    this.data.setItem('lat2', this.lat2);
    this.data.setItem('long2', this.long2);
   this.updateMap();
  }
    
  

  private async updateMap(): Promise<void> {
    // Centrar el mapa en la nueva posición del usuario
    this.getCurrentPosition();
    this.map.setView([this.repp.direccion[0],this.repp.direccion[1]], this.map.getZoom());
    this.perso = await this.data.getItem('perso');
    if (this.perso == false){
      this.lat2 = this.repp.direccion[0];
      this.long2 = this.repp.direccion[1];
    }
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

    // Trazar línea desde la ubicación del usuario hasta el destino
    const latlngs: L.LatLngExpression[] = [
      [this.latitude, this.longitude],
      [this.lat2, this.long2]
    ];

    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);

    // Ajustar la vista del mapa para que incluya ambos puntos
    this.map.fitBounds(polyline.getBounds());
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
    this.lat2 = this.repp.direccion[0];
    this.long2 =this.repp.direccion[1];
    this.map = L.map('map', {
      center: [this.repp.direccion[0],this.repp.direccion[1]], // Centro del mapa
      zoom: 20, // Nivel de zoom (ajusta según sea necesario)
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);
  }
  resetMap(): void {
    // Destruir el mapa existente
    if (this.map) {
      this.map.remove();
    }
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
