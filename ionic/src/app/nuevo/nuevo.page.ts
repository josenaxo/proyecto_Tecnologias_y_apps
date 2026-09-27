import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonToast } from '@ionic/angular';
import { FinanzasService, Tipo } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-nuevo',
  templateUrl: 'nuevo.page.html',
  styleUrls: ['nuevo.page.scss'],
  imports: [FormsModule, RouterLink, IonContent, IonInput, IonToast, NavegacionComponent],
})
export class NuevoPage {
  datos = inject(FinanzasService);
  private router = inject(Router);
  tipo: Tipo = 'gasto';
  monto = '';
  categoria = '';
  descripcion = '';
  aviso = '';

  get categorias() { return this.tipo === 'gasto' ? this.datos.categoriasGasto : this.datos.categoriasIngreso; }
  cambiarTipo(tipo: Tipo): void { this.tipo = tipo; this.categoria = ''; }
  tecla(valor: string): void {
    this.monto = valor === '⌫' ? this.monto.slice(0, -1) : (this.monto + valor).slice(0, 9);
  }
  guardar(): void {
    const monto = Number(this.monto);
    if (!monto || !this.categoria) {
      this.aviso = 'Ingresa un monto y selecciona una categoría.';
      return;
    }
    this.datos.agregarMovimiento(this.descripcion, this.categoria, monto, this.tipo);
    this.router.navigateByUrl('/inicio');
  }
}
