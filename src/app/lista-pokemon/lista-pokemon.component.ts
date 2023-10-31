import { Component } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';

type Pokemon = {
  nombre: string;
  num: number;
  }
  
@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css']
})
export class ListaPokemonComponent {

  
  pokemon: any = '';

  listaPokemon: Pokemon[] =[];

  numeroPokemon: number = 493;
  title = 'pokedex';
  constructor(private pokemonService: PokemonServiceService) {}

  cargaPokemon() {
    
    for(var i =1;i<=this.numeroPokemon;i++){
      
    this.pokemonService.getPokemon(i).subscribe((nuevoPokemon => {
      let poke: Pokemon = {
        nombre: '',
        num: 0
        };
        poke = {
          nombre: nuevoPokemon.name,
          num: nuevoPokemon.id
          }
        this.listaPokemon.push(poke)
    }));
    
    
    console.log(this.listaPokemon)
    } 
}
}