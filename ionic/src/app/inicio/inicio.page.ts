import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonToast } from '@ionic/angular';
import { FinanzasService, Tipo } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  imports: [FormsModule, RouterLink, IonContent, IonInput, IonToast, NavegacionComponent],
})
export class InicioPage {
  datos = inject(FinanzasService);
  mostrarSaldo = true;
  mostrarTodos = false;
  mostrarAnalisis = false;
  filtro: 'todos' | Tipo = 'todos';
  busqueda = '';
  periodo: '3m' | '6m' = '6m';
  aviso = '';

  get movimientosVisibles() {
    if (!this.mostrarTodos) return this.datos.movimientos.slice(0, 5);
    return this.datos.movimientos.filter(m =>
      (this.filtro === 'todos' || m.tipo === this.filtro) &&
      (m.nombre + ' ' + m.categoria).toLowerCase().includes(this.busqueda.toLowerCase()));
  }
  get mesesVisibles() { return this.periodo === '3m' ? this.datos.meses.slice(-3) : this.datos.meses; }
}
