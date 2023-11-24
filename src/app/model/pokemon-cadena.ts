import { Pokemon } from "./pokemon";
import { Trigger } from "./trigger";
/*
export interface Evolution {
pokemons: Pokemon[];
triggers?: Trigger[];
}*/
export interface Evolution {
  pokemons: Pokemon[];
  triggers: string[][];
  }/**/