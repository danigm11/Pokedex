import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from './model/pokemon';
import { PokemonDetail } from './model/pokemon-detail';
import { Evolution } from './model/pokemon-cadena';
import { Moves } from './model/listas-movs';
import { Move } from './model/move';
import { MoveSimple } from './model/move-simple';

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
    const pokemonEndpoint = this.http.get(
      'https://pokeapi.co/api/v2/pokemon/' + id
    );
    const speciesEndpoint = this.http.get(
      'https://pokeapi.co/api/v2/pokemon-species/' + id
    );

    return forkJoin({
      pokemon: pokemonEndpoint,
      species: speciesEndpoint,
    }).pipe(
      map((responses: any) => {
        const nuevoPokemon = responses.pokemon;
        const species = responses.species;
        return this.mapPokemonDetailData(nuevoPokemon, species);
      })
    );
  }

  private mapPokemonDetailData(poke: any, species: any): PokemonDetail {
    let tipos = [poke.types[0].type.name];
    if (poke.types[1]) {
      tipos.push(poke.types[1].type.name);
    }
    let desc:any
    if(localStorage.getItem('language')=='es'){
       desc = species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'es' && entry.version.name === 'x'
      ).flavor_text;
    }else{
       desc = species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en' && entry.version.name === 'x'
      ).flavor_text;
    }
    
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
      ataque: poke.stats[1].base_stat,
      defensa: poke.stats[2].base_stat,
      ataque_especial: poke.stats[3].base_stat,
      defensa_especial: poke.stats[4].base_stat,
      velocidad: poke.stats[5].base_stat,
      cadena: species.evolution_chain.url,
    };
  }

  getCadena(url: string) {
    return this.http.get(url).pipe(
      map((cadena: any) => {
        return this.mapCadenaData(cadena, url);
      })
    );
  }

  private mapCadenaData(cadena: any, url: string): Evolution {
    let listaPokemonsInicial: Pokemon[] = [];
    let listaPokemons: Pokemon[] = [];
    let listaPokemons2: Pokemon[] = [];
    let poke: any;
    let detallesEvo: any[] = [];
    let trigg: string[] = [];
    this.getPokemon(
      this.obtenerNumeroDesdeURL(cadena.chain.species.url)
    ).subscribe((nuevoPokemon: Pokemon) => {
      poke = nuevoPokemon;
      listaPokemonsInicial.push(poke);
    });
    for (let evo of cadena.chain.evolves_to) {
      if (this.obtenerNumeroDesdeURL(evo.species.url) < 494) {
        this.getPokemon(this.obtenerNumeroDesdeURL(evo.species.url)).subscribe(
          (nuevoPokemon: Pokemon) => {
            poke = nuevoPokemon;
            listaPokemons.push(poke);
            listaPokemons.sort((a, b) => a.num - b.num);
          }
        );
        for (let trigger in evo.evolution_details[0]) {
          if (evo.evolution_details[0][trigger]) {
            if (evo.evolution_details[0][trigger].name) {
              trigg.push(evo.evolution_details[0][trigger].name);
            } else {
              trigg.push(evo.evolution_details[0][trigger]);
            }
          } else {
            trigg.push(evo.evolution_details[0][trigger]);
          }
        }
        detallesEvo.push(trigg);
        trigg = [];
      }
      for (let evo2 of evo.evolves_to) {
        if (this.obtenerNumeroDesdeURL(evo.species.url) < 494) {
          this.getPokemon(
            this.obtenerNumeroDesdeURL(evo2.species.url)
          ).subscribe((nuevoPokemon: Pokemon) => {
            poke = nuevoPokemon;
            listaPokemons2.push(poke);
            listaPokemons2.sort((a, b) => a.num - b.num);
          });
          for (let trigger in evo.evolution_details[0]) {
            if (evo2.evolution_details[0][trigger]) {
              if (evo2.evolution_details[0][trigger].name) {
                trigg.push(evo2.evolution_details[0][trigger].name);
              } else {
                trigg.push(evo2.evolution_details[0][trigger]);
              }
            } else {
              trigg.push(evo2.evolution_details[0][trigger]);
            }
          }
          detallesEvo.push(trigg);
          trigg = [];
        }
      }
    }
    return {
      pokemon: listaPokemonsInicial,
      evo1: listaPokemons,
      evo2: listaPokemons2,
      triggers: detallesEvo,
    };
  }

  private obtenerNumeroDesdeURL(url: string): number {
    const partes = url.split('/');
    return parseInt(partes[partes.length - 2]);
  }

  getPokemonMoves(n: number): Observable<Moves> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + n).pipe(
      map((nuevoPokemon: any) => {
        return this.mapPokemonMoveData(nuevoPokemon);
      })
    );
  }

  private mapPokemonMoveData(poke: any): Moves {
    const movesNivel: MoveSimple[] = [];
    const movesMT: MoveSimple[] = [];
  
    poke.moves.forEach((move: any) => {
      
      const levelUpDetails = move.version_group_details.find(
        (detail: any) =>
          detail.version_group.name === 'platinum' &&
          detail.move_learn_method.name === 'level-up'
      );

      const machineDetails = move.version_group_details.find(
        (detail: any) =>
          detail.version_group.name === 'platinum' &&
          detail.move_learn_method.name === 'machine'
      );
  
      if (levelUpDetails) {
        const level = levelUpDetails.level_learned_at;
        movesNivel.push({ url: move.move.url, nivel: level.toString() });
      }
  
      if (machineDetails) {
        movesMT.push({ url: move.move.url, nivel: '0' });
      }
    });
  
    return {
      nivel: movesNivel,
      mts: movesMT,
    };
  }
  
  getMove(url: string,nivel: string): Observable<Move>{
    return this.http.get(url).pipe(
      map((nuevoMovimiento: any) => {
        return this.mapMoveData(nuevoMovimiento,nivel);
      })
    );
  }

  private mapMoveData(move: any,nivel:string): Move {
    let descEntry:any;
    if(localStorage.getItem('language')=='es'){
       descEntry = move.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'es'
      );
    }else{
      descEntry = move.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );
    }
    const desc = descEntry ? descEntry.flavor_text : 'Descripción no disponible';
    let nombre:any;
    if(localStorage.getItem('language')=='en'){
      nombre = move.name || 'Name not available';
    }else{
      nombre = move.names.find(
        (name: any) => name.language.name === 'es'
      ).name;
    }

     if(Number(nivel)==0){
      this.http.get(move.machines.find(
        (detail: any) =>
          detail.version_group.name === 'platinum'
      ).machine.url).subscribe((moves:any)=>{
        nivel=moves.item.name
        console.log(nivel)
      });
    }

    return {
      nombre: nombre,
      descrip: desc,
      categ: move.damage_class ? move.damage_class.name : 'Categoría no disponible',
      tipo: move.type ? move.type.name : 'Tipo no disponible',
      potencia: move.power,
      precicsion: move.accuracy,
      nivel:nivel,
    };
  }
}