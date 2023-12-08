import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';
import { FormsModule } from '@angular/forms';
import { BotonVolverArribaComponent } from './boton-volver-arriba/boton-volver-arriba.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { EvolutionChainComponent } from './evolution-chain/evolution-chain.component';
import { MoveListComponent } from './move-list/move-list.component';
import { TraducirPipe } from './traducir.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
declarations: [
AppComponent,
ListaPokemonComponent,
BotonVolverArribaComponent,
HeaderComponent,
PokemonDetailComponent,
EvolutionChainComponent,
MoveListComponent,
TraducirPipe,
],
imports: [
BrowserModule,
FormsModule,
HttpClientModule,
AppRoutingModule,
ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
