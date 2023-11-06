import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { Pokemon } from '../model/pokemon';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css'],
})
export class ListaPokemonComponent implements OnInit {
  listaPokemon: Pokemon[] = [];
  listaAux: Pokemon[] = [];
  filtroNombre: string = '';
  numeroInicial: number = 1;
  numeroPokemon: number = 493;

  constructor(private pokemonService: PokemonServiceService) {}
  ngOnInit(): void {
    this.cargaPokemon();
  }
  cargaPokemon() {
    this.listaPokemon = [];
    this.pokemonService.getPokemons().subscribe((pokemons: Pokemon[]) => {
      for (let i = this.numeroInicial; i <= this.numeroPokemon; i++) {
        this.listaPokemon.push(pokemons[i - 1]);
      }
      this.listaAux = this.listaPokemon;
    });
  }

  filtrarNombre() {
    this.listaPokemon = this.listaAux.filter((Pokemon) =>
      Pokemon.nombre.includes(this.filtroNombre.toLowerCase())
    );
  }
}
