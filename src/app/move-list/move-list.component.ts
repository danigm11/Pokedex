import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonServiceService } from '../pokemon-service.service';
import { Move } from '../model/move';
import { MoveSimple } from '../model/move-simple';

@Component({
  selector: 'app-move-list',
  templateUrl: './move-list.component.html',
  styleUrls: ['./move-list.component.css']
})
export class MoveListComponent {
  @Input()
  id:number=0
  listaNivel: MoveSimple[]=[]
  listaMt: MoveSimple[]=[]
  listaDetalleNivel: Move[]=[]
  listaDetalleMt: Move[]=[]

  constructor(
    private pokemonService: PokemonServiceService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnChanges(): void{
    this.limpiarListas()
    this.leerListasMoves()
  }

  leerListasMoves(){
    this.pokemonService.getPokemonMoves(this.id).subscribe((moves:any)=>{

     this.listaNivel= moves.nivel
     this.listaMt= moves.mts

    for(let move of this.listaNivel){
      this.pokemonService.getMove(move.url,move.nivel).subscribe((movimiento:any)=>{
        this.listaDetalleNivel.push(movimiento)
        this.listaDetalleNivel.sort((a, b) => parseInt(a.nivel) - parseInt(b.nivel));

      })
     }
     for(let move of this.listaMt){
      this.pokemonService.getMove(move.url,move.nivel).subscribe((movimiento:any)=>{
        this.listaDetalleMt.push(movimiento)
        
      })
     }
    })
  }

  limpiarListas(){
    this.listaDetalleNivel=[]
    this.listaDetalleMt=[]
  }
}
