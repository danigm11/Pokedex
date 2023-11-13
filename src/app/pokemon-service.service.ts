import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Pokemon } from './model/pokemon';
import { PokemonDetail } from './model/pokemon-detail';

@Injectable({
  providedIn: 'root',
})
export class PokemonServiceService {
  constructor(private http: HttpClient) {}

  getPokemon(n: number): Observable<Pokemon> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + n).pipe(
      map((nuevoPokemon: any) => {
        return this.mapPokemonData(nuevoPokemon);
      })
    );
  }
  getPokemons(): Observable<Pokemon[]> {
    var observables: Observable<Pokemon>[] = [];

    for (let i = 1; i <= 493; i++) {
      observables.push(this.getPokemon(i));
    }
    return forkJoin(observables);
  }

  private mapPokemonData(poke: any): Pokemon {
    let tipos = [poke.types[0].type.name];
    if (poke.types[1]) {
      tipos.push(poke.types[1].type.name);
    }
    return {
      nombre: poke.name,
      num: poke.id,
      imagen: poke.sprites.other['official-artwork'].front_default,
      tipos: tipos,
    };
  }
  
    getDetalles(id: number): Observable<PokemonDetail> {
      return this.http.get('https://pokeapi.co/api/v2/pokemon/' + id).pipe(
        mergeMap((nuevoPokemon: any) => {
          return this.http.get('https://pokeapi.co/api/v2/pokemon-species/' + id).pipe(
            map((species: any) => {
              return this.mapPokemonDetailData(nuevoPokemon, species);
            })
          );
        })
      );
      }

      private mapPokemonDetailData(poke: any, species: any): PokemonDetail {
        let tipos = [poke.types[0].type.name];
        if (poke.types[1]) {
          tipos.push(poke.types[1].type.name);
        }
        
        const desc = species.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'es'&& entry.version.name==='x'
        ).flavor_text;
    
        return {
          nombre: poke.name,
          num: poke.id,
          imagen: poke.sprites.other['official-artwork'].front_default,
          imagenShiny: poke.sprites.other['official-artwork'].front_shiny,
          altura: poke.height / 10,
          peso: poke.weight / 10,
          descripcion: desc,
          tipos: tipos,
          vida: poke.stats[0].base_stat,
          ataque:poke.stats[1].base_stat,
          defensa: poke.stats[2].base_stat,
          ataque_especial:poke.stats[3].base_stat,
          defensa_especial: poke.stats[4].base_stat,
          velocidad:poke.stats[5].base_stat,
        };
      }
}
