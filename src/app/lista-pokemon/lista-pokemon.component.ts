import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { Pokemon } from '../model/pokemon';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css'],
})
export class ListaPokemonComponent implements OnInit {
  listaTodo: Pokemon[] = [];
  listaMostrada: Pokemon[] = [];
  listaAux: Pokemon[] = [];
  filtroNombre: string = '';
  numeroInicial: number = 1;
  numeroPokemon: number = 151;
  ultimoPulsado: number =1;

  constructor(private pokemonService: PokemonServiceService) {}
  ngOnInit(): void {
    this.cargaPokemon();
  }
  cargaPokemon() {
    this.pokemonService.getPokemons().subscribe((pokemons: Pokemon[]) => {
      this.listaMostrada = pokemons.filter((Pokemon) =>
      (Pokemon.num<=this.numeroPokemon)&&(Pokemon.num>=this.numeroInicial)
    );
      this.listaAux = this.listaMostrada;
      this.listaTodo = pokemons;
    });
  }

  filtrarNombre() {
    this.listaMostrada = this.listaAux.filter((Pokemon) =>
      Pokemon.nombre.includes(this.filtroNombre.toLowerCase())
    );
  }
  filtrarGen(n: number) {
    switch(n){
      case 1:{
        this.numeroInicial= 1;
        this.numeroPokemon = 151;
        break;
      }
      case 2:{
        this.numeroInicial= 152;
        this.numeroPokemon = 251;
        break;
      }
      case 3:{
        this.numeroInicial= 252;
        this.numeroPokemon = 386;
        break;
      }
      case 4:{
        this.numeroInicial= 387;
        this.numeroPokemon = 493;
        break;
      }
      case 5:{
        this.numeroInicial= 1;
        this.numeroPokemon = 493;
        break;
      }
    }
    this.listaMostrada = this.listaTodo.filter((Pokemon) =>
      (Pokemon.num<=this.numeroPokemon)&&(Pokemon.num>=this.numeroInicial)
    );
    this.listaAux = this.listaMostrada;
    this.ultimoPulsado = n;
  }
}