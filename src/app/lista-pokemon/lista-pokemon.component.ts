import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { Pokemon } from '../model/pokemon';
type tipoDeTipos = {
  name: string;
  status: boolean;
};
@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css'],
})
export class ListaPokemonComponent implements OnInit {
  animate: boolean = false;
  mostrarSelector: boolean = false;
  listaTodo: Pokemon[] = [];
  listaMostrada: Pokemon[] = [];
  filtroNombre: string = '';
  listaDeTipos: tipoDeTipos[] = [
    { name: 'bug', status: false },
    { name: 'dark', status: false },
    { name: 'dragon', status: false },
    { name: 'electric', status: false },
    { name: 'fairy', status: false },
    { name: 'fighting', status: false },
    { name: 'fire', status: false },
    { name: 'flying', status: false },
    { name: 'ghost', status: false },
    { name: 'grass', status: false },
    { name: 'ground', status: false },
    { name: 'ice', status: false },
    { name: 'normal', status: false },
    { name: 'poison', status: false },
    { name: 'psychic', status: false },
    { name: 'rock', status: false },
    { name: 'steel', status: false },
    { name: 'water', status: false },
  ];
  filtroTipo: string[] = [];
  numeroInicial: number = 1;
  numeroPokemon: number = 151;
  ultimoPulsado: number = 1;

  constructor(private pokemonService: PokemonServiceService) {}
  ngOnInit(): void {
    this.cargaPokemon();
    console.log(this.filtroTipo);
  }
  cargaPokemon() {
    this.pokemonService.getPokemons().subscribe((pokemons: Pokemon[]) => {
      this.listaMostrada = pokemons.filter(
        (Pokemon) =>
          Pokemon.num <= this.numeroPokemon && Pokemon.num >= this.numeroInicial
      );
      this.listaTodo = pokemons;
    });
  }
  aplicarFiltros(n: number) {
    this.filtrarGen(n);
    this.filtrarTipo();
    this.filtrarNombre();
  }

  filtrarNombre() {
    this.listaMostrada = this.listaMostrada.filter((Pokemon) =>
      Pokemon.nombre.includes(this.filtroNombre.toLowerCase())
    );
  }
  filtrarGen(n: number) {
    switch (n) {
      case 1: {
        this.numeroInicial = 1;
        this.numeroPokemon = 151;
        break;
      }
      case 2: {
        this.numeroInicial = 152;
        this.numeroPokemon = 251;
        break;
      }
      case 3: {
        this.numeroInicial = 252;
        this.numeroPokemon = 386;
        break;
      }
      case 4: {
        this.numeroInicial = 387;
        this.numeroPokemon = 493;
        break;
      }
      case 5: {
        this.numeroInicial = 1;
        this.numeroPokemon = 493;
        break;
      }
    }
    this.listaMostrada = this.listaTodo.filter(
      (Pokemon) =>
        Pokemon.num <= this.numeroPokemon && Pokemon.num >= this.numeroInicial
    );

    this.ultimoPulsado = n;
  }
  filtrarTipo() {
    this.filtroTipo = [];
    for (let i = 0; i < 18; i++) {
      if (this.listaDeTipos[i].status) {
        this.filtroTipo.push(this.listaDeTipos[i].name);
      }
    }
    if (this.filtroTipo.length < 1) {
      for (let i = 0; i < 18; i++) {
        this.filtroTipo.push(this.listaDeTipos[i].name);
      }
    }
    this.listaMostrada = this.listaMostrada.filter(
      (Pokemon) =>
        this.filtroTipo.includes(Pokemon.tipos[0]) ||
        this.filtroTipo.includes(Pokemon.tipos[1])
    );
  }
}
