import { Component } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { PokemonDetail } from '../model/pokemon-detail';
import { Evolution } from '../model/pokemon-cadena';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evolution-chain',
  templateUrl: './evolution-chain.component.html',
  styleUrls: ['./evolution-chain.component.css']
})
export class EvolutionChainComponent {
  id: number = 0;
  detalle: any;
  pokes:any;

  constructor(
    private pokemonService: PokemonServiceService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
    this.cargaPokemon();
  }

  cargaPokemon() {
    this.pokemonService
      .getDetalles(this.id)
      .subscribe((pokemons: PokemonDetail) => {
        this.detalle = pokemons;
        this.cargaCadenasEvolutivas();
      });
    }

  cargaCadenasEvolutivas(){
    this.pokemonService
      .getCadena(this.detalle.cadena)
      .subscribe((evo: Evolution)=>{
        this.pokes=evo;
      });
  }

}
