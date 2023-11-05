import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-volver-arriba',
  templateUrl: './boton-volver-arriba.component.html',
  styleUrls: ['./boton-volver-arriba.component.css']
})
export class BotonVolverArribaComponent {
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
