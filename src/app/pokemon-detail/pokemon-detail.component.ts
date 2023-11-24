import { Component, OnDestroy } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { PokemonDetail } from '../model/pokemon-detail';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, map } from 'rxjs';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnDestroy{

  unsubs: Subscription | null = null;

  id: number = 0;
  detalle: any;
  imagenActual: string = '';
  ctx:any;

  listaX4: String[] = [];
  listaX2: String[] = [];
  listaX1: String[] = [];
  listaX12: String[] = [];
  listaX14: String[] = [];
  listaX0: String[] = [];
  listaX2Aux: String[] = [];
  listaX1Aux: String[] = [];
  listaX12Aux: String[] = [];
  listaX0Aux: String[] = [];

  constructor(
    private pokemonService: PokemonServiceService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient

  ) {
  }

  ngOnInit(): void {
    this.unsubs= this.activatedRoute.params.subscribe(data=>{
      this.id = data['id'];    
      this.borrarListas();
      this.cargaPokemon();
      Chart.getChart(this.ctx)?.destroy();
      this.createPieChart();
    })
  }
  
  ngOnDestroy():void{
    this.unsubs?.unsubscribe();
  }

  ngAfterViewInit(): void {
    Chart.getChart(this.ctx)?.destroy();
    this.createPieChart();
  }

  cargaPokemon() {
    this.pokemonService
      .getDetalles(this.id)
      .subscribe((pokemons: PokemonDetail) => {
        this.detalle = pokemons;
        this.imagenActual = this.detalle.imagen;

        const loadLists = () => {
          this.cargarListas(pokemons.tipos[0], 2)
            .then(() => this.cargarListas(pokemons.tipos[0], 0))
            .then(() => this.cargarListas(pokemons.tipos[0], 0.5))
            .then(() => this.ngAfterViewInit())
            .then(() => {
              if (pokemons.tipos[1]) {
                this.cargarListas(pokemons.tipos[1], 2)
                  .then(() => this.cargarListas(pokemons.tipos[1], 0))
                  .then(() => this.cargarListas(pokemons.tipos[1], 0.5))
                  .then(() => this.ordenarListasX());
              }
            });
        };
        
        loadLists();
      });
  }

  cambiarImagen() {
    this.imagenActual =
      this.imagenActual === this.detalle.imagen
        ? this.detalle.imagenShiny
        : this.detalle.imagen;
  }

  getJsonData(): Observable<any> {
    return this.http.get<any>('./assets/tablaDeTipos.json');
  }

  returnJsonData(tipo: string, efectividad: number): Observable<String[]> {
    return this.getJsonData().pipe(
      map((data) => {
        return data[tipo][efectividad] as String[];
      })
    );
  }

  async cargarListas(tipo: string, n: number): Promise<void> {
    try {
      const data = await this.returnJsonData(tipo, n).toPromise();
      if (data !== undefined) {
        if (n === 2) {
          this.listaX2Aux = this.listaX2.slice();
          this.listaX2 = data;
        } else if (n === 0) {
          this.listaX0Aux = this.listaX0.slice();
          this.listaX0 = data;
        } else if (n === 0.5) {
          this.listaX12Aux = this.listaX12.slice();
          this.listaX12 = data;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  ordenarListasX() {
    this.listaX0Aux.forEach((elemento) => {
      if (!this.listaX0.includes(elemento)) {
        this.listaX0.push(elemento);
      }
    });
    this.listaX4 = this.listaX2.filter((item) =>
      this.listaX2Aux.includes(item)
    );
    this.listaX2Aux.forEach((elemento) => {
      if (!this.listaX2.includes(elemento)) {
        this.listaX2.push(elemento);
      }
    });
    this.listaX14 = this.listaX12.filter((item) =>
      this.listaX12Aux.includes(item)
    );
    this.listaX12Aux.forEach((elemento) => {
      if (!this.listaX12.includes(elemento)) {
        this.listaX12.push(elemento);
      }
    });
    this.listaX2 = this.listaX2.filter((item) => !this.listaX4.includes(item));
    this.listaX12 = this.listaX12.filter(
      (item) => !this.listaX14.includes(item)
    );
    this.listaX2 = this.listaX2.filter((item) => !this.listaX0.includes(item));

    this.listaX12 = this.listaX12.filter(
      (item) => !this.listaX0.includes(item)
    );
    let listaX2copia: String[] = this.listaX2;
    this.listaX2 = this.listaX2.filter(
      (elemento) => !this.listaX12.includes(elemento)
    );
    this.listaX12 = this.listaX12.filter(
      (elemento) => !listaX2copia.includes(elemento)
    );
  }

  createPieChart() {
    
    setTimeout(() => {
      this.ctx = document.getElementById('grafica') as HTMLCanvasElement;
      if (!this.ctx) {
        return;
      }
      const data = {
        labels: [
          'HP ' + this.detalle.vida,
          'Attack ' + this.detalle.ataque,
          'Defense ' + this.detalle.defensa,
          'S.Attack ' + this.detalle.ataque_especial,
          'S.Defense ' + this.detalle.defensa_especial,
          'Speed ' + this.detalle.velocidad,
        ],
        datasets: [
          {
            label: 'Stats',
            data: [
              this.detalle.vida,
              this.detalle.ataque,
              this.detalle.defensa,
              this.detalle.ataque_especial,
              this.detalle.defensa_especial,
              this.detalle.velocidad,
            ],
            fill: true,
            backgroundColor: 'rgba(204, 204, 255, 0.7 )',
            borderColor: 'rgb(121, 51, 153)',
            pointBackgroundColor: 'rgb(0, 0, 0)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
          },
          {
            label: '',
            data: [0, 0, 0, 0, 0, 0, 200],
            fill: false,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(255, 99, 132, 0)',
            pointBackgroundColor: 'rgba(0, 0, 0,0)',
            pointBorderColor: 'rgba(0, 0, 0,0)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
          },
        ],
      };
      Chart.defaults.font.size = 0;
      const config: any = {
        type: 'radar',
        data: data,
        options: {
          scales: {
            r: {
              angleLines: {
                color: 'black',
              },
              pointLabels: {
                color: 'black',
                font: {
                  size: 15,
                },
              },
              grid: {
                color: 'grey',
              },
            },
          },
        },
      };
      new Chart(this.ctx, config);
    }, 1);
  }

  borrarListas(){
    this.listaX4= [];
    this.listaX2= [];
    this.listaX1= [];
    this.listaX12= [];
    this.listaX14 = [];
    this.listaX0= [];
  }
}


