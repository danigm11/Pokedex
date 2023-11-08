import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';
import { FormsModule } from '@angular/forms';
import { BotonVolverArribaComponent } from './boton-volver-arriba/boton-volver-arriba.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
declarations: [
AppComponent,
ListaPokemonComponent,
BotonVolverArribaComponent,
HeaderComponent
],
imports: [
BrowserModule,
FormsModule,
HttpClientModule,
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
