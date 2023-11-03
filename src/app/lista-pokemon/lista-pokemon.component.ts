import { Component, OnInit } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';

type Pokemon = {
  nombre: string;
  num: number;
  imagen: string;
  tipos:any;
};

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css'],
})
export class ListaPokemonComponent implements OnInit {
  pokemon: any = '';
  listaPokemon: Pokemon[] = [];
  numeroInicial: number = 1;
  numeroPokemon: number = 151;
  title = 'pokedex';
  constructor(private pokemonService: PokemonServiceService) {}
  ngOnInit(): void {
    this.cargaPokemon();
    this.filtrarNombre();
  }

  cargaPokemon() {
    this.listaPokemon = [];
    for (var i = this.numeroInicial; i <= this.numeroPokemon; i++) {
      this.pokemonService.getPokemon(i).subscribe((nuevoPokemon) => {
        let poke: Pokemon = {
          nombre: '',
          num: 0,
          imagen: '',
          tipos: [],
        };
        if((nuevoPokemon.types[1]!=null)){
          poke = {
            nombre: nuevoPokemon.name,
            num: nuevoPokemon.id,
            imagen: nuevoPokemon.sprites.other['official-artwork'].front_default,
            tipos: [(nuevoPokemon.types[0].type.name),(nuevoPokemon.types[1].type.name)],
          };
        }else{
          poke = {
            nombre: nuevoPokemon.name,
            num: nuevoPokemon.id,
            imagen: nuevoPokemon.sprites.other['official-artwork'].front_default,
            tipos: [(nuevoPokemon.types[0].type.name)],
          };
        }
        
        this.listaPokemon.push(poke);
        this.listaPokemon.sort;
      });
    }
  }

  filtrarNombre() {
    this.listaPokemon = this.listaPokemon.filter((Pokemon) =>
      Pokemon.nombre.includes('char'.toLowerCase())
    );
  }
}