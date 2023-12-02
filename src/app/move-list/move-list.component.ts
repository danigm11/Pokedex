import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonServiceService } from '../pokemon-service.service';
import { Move } from '../model/move';

@Component({
  selector: 'app-move-list',
  templateUrl: './move-list.component.html',
  styleUrls: ['./move-list.component.css']
})
export class MoveListComponent {
id:number=0
listaNivel: string[]=[]
listaMt: string[]=[]
listaDetalleNivel: Move[]=[]
listaDetalleMt: Move[]=[]

constructor(
  private pokemonService: PokemonServiceService,
  private activatedRoute: ActivatedRoute,
) {}
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    this.leerListasMoves()
  }

  leerListasMoves(){
    this.pokemonService.getPokemonMoves(this.id).subscribe((moves:any)=>{
     this.listaNivel= moves.nivel
     this.listaMt= moves.mts

    for(let url of this.listaNivel){
      this.pokemonService.getMove(url).subscribe((movimiento:any)=>{
        this.listaDetalleNivel.push(movimiento)
      })
     }
     for(let url of this.listaMt){
      this.pokemonService.getMove(url).subscribe((movimiento:any)=>{
        this.listaDetalleMt.push(movimiento)
      })
     }
    })
    
  }
}
