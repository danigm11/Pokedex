import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';

@NgModule({
declarations: [
AppComponent,
ListaPokemonComponent
],
imports: [
BrowserModule,
HttpClientModule,
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
