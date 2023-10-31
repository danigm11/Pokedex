import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
@Injectable({
providedIn: 'root'
})
export class PokemonServiceService {
constructor(private http: HttpClient) { }

getPokemon(n: Number): Observable<any> {
return this.http.get('https://pokeapi.co/api/v2/pokemon/'+n);
}
}