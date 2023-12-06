import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ngOnInit(): void {
    this.setTheme()
  }

setTheme(): void {
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (localStorage.getItem('theme') == 'light') {

  document.body.classList.toggle('dark-theme', !prefersLight);

} else {
  document.body.classList.toggle('light-theme', prefersLight);

}
}
}
