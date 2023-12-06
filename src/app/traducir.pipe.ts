import { Pipe, PipeTransform } from '@angular/core';
const TRADUCCIONES = [
  {
    en: 'fire',
    es: 'fuego',
  },
  {
    en: 'water',
    es: 'agua',
  },
  {
    en: 'grass',
    es: 'planta',
  },
  {
    en: 'dark',
    es: 'siniestro',
  },
  {
    en: 'ice',
    es: 'hielo',
  },
  {
    en: 'ghost',
    es: 'fantasma',
  },
  {
    en: 'fighting',
    es: 'lucha',
  },
  {
    en: 'psychic',
    es: 'psíquico',
  },
  {
    en: 'ground',
    es: 'tierra',
  },
  {
    en: 'rock',
    es: 'roca',
  },
  {
    en: 'bug',
    es: 'bicho',
  },
  {
    en: 'dragon',
    es: 'dragon',
  },
  {
    en: 'fairy',
    es: 'hada',
  },
  {
    en: 'steel',
    es: 'acero',
  },
  {
    en: 'flying',
    es: 'volador',
  },
  {
    en: 'poison',
    es: 'veneno',
  },
  {
    en: 'normal',
    es: 'normal',
  },
  {
    en: 'fairy',
    es: 'hada',
  },
  {
    en: 'Height',
    es: 'Altura',
  },
  {
    en: 'Weight',
    es: 'Peso',
  },
  {
    en: 'electric',
    es: 'eléctrico',
  },
  {
    en: 'Name',
    es: 'Nombre',
  },
  {
    en: 'Power',
    es: 'Potencia',
  },
  {
    en: 'Accuracy',
    es: 'Precicsión',
  },
  {
    en: 'Description',
    es: 'Descripción',
  },
  {
    en: 'Category',
    es: 'Categoría',
  },
  {
    en: 'Type',
    es: 'Tipo',
  },
  {
    en: 'Move List',
    es: 'Lista de Movimientos',
  },
  {
    en: 'Level',
    es: 'Nivel',
  },
  {
    en: 'TM',
    es: 'MT',
  },
  {
    en: 'Weaknesses',
    es: 'Debilidades',
  },
  {
    en: 'Location',
    es: 'Localización',
  },
  {
    en: 'Happiness',
    es: 'Felicidad',
  },
  {
    en: 'Gender',
    es: 'Sexo',
  },
  {
    en: 'Time of Day',
    es: 'Hora del día',
  },
  {
    en: 'night',
    es: 'Noche',
  },
  {
    en: 'day',
    es: 'Día',
  },
  {
    en: 'Beauty',
    es: 'Belleza',
  },
  {
    en: 'use-item',
    es: 'Usar Objeto',
  },
  {
    en: 'level-up',
    es: 'Subir de Nivel',
  },
  
];
type Idioma = 'en' | 'es';
@Pipe({
  name: 'traducir',
})
export class TraducirPipe implements PipeTransform {
  transform(texto: string, idioma: Idioma): string {
    const traduccion = TRADUCCIONES.filter((t) => t['en'] === texto)[0];
    if (traduccion) {
      if (localStorage.getItem('language') == 'en') {
        return traduccion['en'];
      } else {
        return traduccion['es'];
      }
    } else {
      return '';
    }
  }
}
