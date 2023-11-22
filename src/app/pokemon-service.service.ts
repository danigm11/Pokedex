import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Pokemon } from './model/pokemon';
import { PokemonDetail } from './model/pokemon-detail';
import { Evolution } from './model/pokemon-cadena';
import { Trigger } from './model/trigger';

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
          cadena:species.evolution_chain.url,
        };
      }

      getCadena(url: string) {
       return this.http.get(url).pipe(
      map((cadena: any) => {
        return this.mapCadenaData(cadena);
      })
    );

      }
      private mapCadenaData(cadena: any): Evolution {
        let listaPokemons: Pokemon[]=[];
        let poke: any;
        this.getPokemon(this.obtenerNumeroDesdeURL(cadena.chain.species.url)).subscribe((nuevoPokemon: Pokemon) => {
          poke=nuevoPokemon;
          listaPokemons.push(poke);
        });
        for(let evo of cadena.chain.evolves_to){
          if(this.obtenerNumeroDesdeURL(evo.species.url)<494){
            this.getPokemon(this.obtenerNumeroDesdeURL(evo.species.url)).subscribe((nuevoPokemon: Pokemon) => {
              poke=nuevoPokemon;
              listaPokemons.push(poke);
            });
          }
          for(let evo2 of evo.evolves_to){
            if(this.obtenerNumeroDesdeURL(evo.species.url)<494){
              this.getPokemon(this.obtenerNumeroDesdeURL(evo2.species.url)).subscribe((nuevoPokemon: Pokemon) => {
                poke=nuevoPokemon;
                listaPokemons.push(poke);
              });
            }
          }
        }
        let detallesEvo:any[] = [];
        let trigg:any;
        detallesEvo[0] = [];
        /*for(let evo of cadena.chain.evolves_to){
          if(this.obtenerNumeroDesdeURL(evo.species.url)<494){
            this.getTriggers(evo.evolution_details[0]).subscribe((nuevoTrigger: Trigger) => {
              trigg=nuevoTrigger;
              detallesEvo.push(trigg);
            });
          }
          for(let evo2 of evo.evolves_to){
            if(this.obtenerNumeroDesdeURL(evo.species.url)<494){
              this.getTriggers(evo2.evolution_details[0]).subscribe((nuevoTrigger: Trigger) => {
                trigg=nuevoTrigger;
                detallesEvo.push(trigg);
              });
            }
          }
        }*/
        return {
          pokemons: listaPokemons,
          triggers: detallesEvo,
        };
      }

      private obtenerNumeroDesdeURL(url:string):number {
        const partes = url.split("/");
        return parseInt(partes[partes.length - 2]);
      }
      getTriggers(url: string): Observable<Trigger> {
        return this.http.get(url).pipe(
          map((nuevoTrigger: any) => {
            return this.mapTriggerData(nuevoTrigger);
          })
        );
      }
    
      private mapTriggerData(trig: any): Trigger{
        return {
          gender: trig.gender,
          held_item: trig.held_item.name,
          item: trig.item.name,
          known_move: trig.known_move,
          known_move_type: trig.known_move_type,
          location: trig.location.name,
          min_affection: trig.min_affection,
          min_beauty: trig.min_beauty,
          min_happiness: trig.min_happiness,
          min_level: trig.min_level,
          needs_overworld_rain: trig.needs_overworld_rain,
          party_species: trig.party_species,
          party_type: trig.party_type,
          relative_physical_stats: trig.relative_physical_stats,
          time_of_day: trig.time_of_day,
          trade_species: trig.trade_species,
          trigger: trig.trigger.name
        };
      }
      
}
