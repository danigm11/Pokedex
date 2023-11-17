import { Component } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { PokemonDetail } from '../model/pokemon-detail';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent {
  id: number = 0;
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
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
    this.cargaPokemon();
  }
  detalle: any;
  imagenActual: string = '';
  constructor(
    private pokemonService: PokemonServiceService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  async cargaPokemon() {
    try {
      const pokemons: PokemonDetail | undefined = await this.pokemonService
        .getDetalles(this.id)
        .toPromise();

      if (pokemons) {
        this.detalle = pokemons;
        this.imagenActual = this.detalle.imagen;

        await this.cargarListasX(pokemons.tipos[0], 2);
        await this.cargarListasX(pokemons.tipos[0], 0);
        await this.cargarListasX(pokemons.tipos[0], 0.5);

        if (pokemons.tipos[1]) {
          await this.cargarListasX(pokemons.tipos[1], 2);
          await this.cargarListasX(pokemons.tipos[1], 0);
          await this.cargarListasX(pokemons.tipos[1], 0.5);
        }
      } else {
        console.error('Pokemon details not found');
      }
    } catch (error) {
      console.error('Error loading Pokemon details:', error);
    }
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
  async cargarListasX(tipo: string, n: number) {
    try {
      const data = await this.returnJsonData(tipo, n).toPromise();

      if (data !== undefined) {
        if (n == 2) {
          this.listaX2Aux = this.listaX2.slice();
          this.listaX2 = data;
        } else if (n == 0) {
          this.listaX0Aux = this.listaX0.slice();
          this.listaX0 = data;
        } else if (n == 0.5) {
          this.listaX12Aux = this.listaX12.slice();
          this.listaX12 = data;
          if (tipo === this.detalle.tipos[1]) {
            this.ordenarListasX();
          }
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
    this.listaX4 = this.listaX4.filter((item) => !this.listaX0.includes(item));
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
}
