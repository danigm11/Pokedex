import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getDetalles(id: Number): Observable<PokemonDetail> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + id).pipe(
      map((nuevoPokemon: any) => {
        return this.mapPokemonDetailData(nuevoPokemon);
      })
    );
  }

  private mapPokemonDetailData(poke: any): PokemonDetail {
    let tipos = [poke.types[0].type.name];
    if (poke.types[1]) {
      tipos.push(poke.types[1].type.name);
    }
    return {
      nombre: poke.name,
      num: poke.id,
      imagen: poke.sprites.other['official-artwork'].front_default,
      altura: poke.height/10,
      peso: poke.weight/10,
      tipos: tipos,
    };
  }
}
