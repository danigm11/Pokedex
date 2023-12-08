import { Component, OnDestroy } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { PokemonDetail } from '../model/pokemon-detail';
import { MoveListComponent } from '../move-list/move-list.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, map } from 'rxjs';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnDestroy {
  unsubs: Subscription | null = null;

  id: number = 0;
  detalle: any;
  imagenActual: string = '';
  ctx:any;
  jsonDatos:any;
  listaX4: string[] = [];
  listaX2: string[] = [];
  listaX1: string[] = [];
  listaX12: string[] = [];
  listaX14: string[] = [];
  listaX0: string[] = [];
  listaX2Aux: string[] = [];
  listaX1Aux: string[] = [];
  listaX12Aux: string[] = [];
  listaX0Aux: string[] = [];

  constructor(
    private pokemonService: PokemonServiceService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient

  ) {}

  ngOnInit(): void {
    this.unsubs = this.activatedRoute.params.subscribe((data) => {
      this.id = data['id'];
      this.borrarListas();
      this.cargaPokemon();
      Chart.getChart(this.ctx)?.destroy();
      this.createPieChart();
    })
  }
  cont:number=0;
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

        this.getJsonData().subscribe((datos: any) => {
          this.jsonDatos=datos;
          this.cargarListas(this.detalle.tipos[0], 2)
          this.cargarListas(this.detalle.tipos[0], 0)
          this.cargarListas(this.detalle.tipos[0], 0.5)
          this.ngAfterViewInit()
                
          if (pokemons.tipos[1]) {
            this.cargarListas2(pokemons.tipos[1], 2)
            this.cargarListas2(pokemons.tipos[1], 0)
            this.cargarListas2(pokemons.tipos[1], 0.5)
            this.ordenarListasX()
            }
        });
       
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

  cargarListas(tipo: string, n: number){
    
  let data:string[]=[];
    try {
    data= this.jsonDatos[tipo][n]
        if (n === 2) {
          this.listaX2 = data;
        } else if (n === 0) {
          this.listaX0 = data;
        } else if (n === 0.5) {
          this.listaX12 = data;
        }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  cargarListas2(tipo: string, n: number){
    let data:string[]=[];
    try {
    data= this.jsonDatos[tipo][n]
        if (n === 2) {
          this.listaX2Aux = data;
        } else if (n === 0) {
          this.listaX0Aux = data;
        } else if (n === 0.5) {
          this.listaX12Aux = data;
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
      let labels:string[]= [
        'Vida ' + this.detalle.vida,
        'Ataque ' + this.detalle.ataque,
        'Defensa ' + this.detalle.defensa,
        'Velocidad ' + this.detalle.velocidad,
        'Defensa.Esp ' + this.detalle.defensa_especial,
        'Ataque.Esp ' + this.detalle.ataque_especial,
      ]
      if(localStorage.getItem('language')=='en'){
  
        labels= [
          'HP ' + this.detalle.vida,
          'Attack ' + this.detalle.ataque,
          'Defense ' + this.detalle.defensa,
          'Speed ' + this.detalle.velocidad,
          'S.Defense ' + this.detalle.defensa_especial,
          'S.Attack ' + this.detalle.ataque_especial,
          
        ]}
      const data = {
        labels,
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
            backgroundColor: 'rgba(44, 84, 205, 0.7 )',
            borderColor: 'navy',
            pointBackgroundColor: 'rgba(0, 0, 0,0)',
            pointBorderColor: 'rgba(0, 0, 0,0)',
            pointHoverBackgroundColor: 'rgba(0, 0, 0,0)',
            pointHoverBorderColor: 'rgba(0, 0, 0,0)',
          },
          {
            label: '',
            data: [0, 0, 0, 0, 0, 0, 200],
            fill: false,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(0, 0, 0,0)',
            pointBorderColor: 'rgba(0, 0, 0,0)',
            pointHoverBackgroundColor: 'rgba(0, 0, 0,0)',
            pointHoverBorderColor: 'rgba(0, 0, 0,0)',
          },
        ],
      };
      Chart.defaults.font.size = 0;
      const config: any = {
        type: 'radar',
        data: data,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            r: {
              angleLines: {
                color: 'black',
              },
              pointLabels: {
                color: 'navy',
                font: {
                  weight:'bold',
                  family:'system-ui  ',
                  size: 15,
                },
              },
              grid: {
                color: 'black',
              },
            },
          },
        },
      };
      new Chart(this.ctx, config);
    }, 1);
  }

  borrarListas() {
    this.listaX4 = [];
    this.listaX2 = [];
    this.listaX1 = [];
    this.listaX12 = [];
    this.listaX14 = [];
    this.listaX0 = [];
  }
}
