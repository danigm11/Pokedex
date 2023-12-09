import { Pokemon } from "./pokemon";

export interface Evolution {
  pokemon: Pokemon[];
  evo1: Pokemon[];
  evo2: Pokemon[];
  triggers: string[][];
  }