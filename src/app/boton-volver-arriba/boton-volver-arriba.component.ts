import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-volver-arriba',
  templateUrl: './boton-volver-arriba.component.html',
  styleUrls: ['./boton-volver-arriba.component.css']
})
export class BotonVolverArribaComponent {
  mostrarBoton = false;
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  onScroll() {
    const scrollPosition = window.scrollY;
    const screenHeight = window.innerHeight;
    const triggerScroll = 0.2;  
    this.mostrarBoton = scrollPosition > screenHeight * triggerScroll;
  }
}
