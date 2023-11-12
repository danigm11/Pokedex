import { Component } from '@angular/core';
import { PokemonServiceService } from '../pokemon-service.service';
import { PokemonDetail } from '../model/pokemon-detail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {
  id: number=0;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    this.cargaPokemon();
  }
  detalle: any;
  imagenActual: string = "";
  descripcion: string="";
  constructor(private pokemonService: PokemonServiceService, private activatedRoute: ActivatedRoute) {
  }
  cargaPokemon(){
    this.pokemonService.getDetalles(this.id).subscribe((pokemons: PokemonDetail) => {
      this.detalle=pokemons;this.imagenActual= this.detalle.imagen;}
      );
  }
  
  cambiarImagen() {
    this.imagenActual = this.imagenActual === this.detalle.imagen ? this.detalle.imagenShiny : this.detalle.imagen;
  }
}
