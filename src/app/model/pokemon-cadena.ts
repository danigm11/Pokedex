import { Pokemon } from "./pokemon";
import { Trigger } from "./trigger";
/*
export interface Evolution {
pokemons: Pokemon[];
triggers?: Trigger[];
}*/
export interface Evolution {
  pokemon: Pokemon[];
  evo1: Pokemon[];
  evo2: Pokemon[];
  triggers: string[][];
  }/**/