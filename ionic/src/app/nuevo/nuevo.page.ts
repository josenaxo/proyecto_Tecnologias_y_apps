import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private cambios = inject(ChangeDetectorRef);
  private router = inject(Router);
  tipo: Tipo = 'gasto';
  monto = '';
  categoria = '';
  descripcion = '';
  cuentaId = '';
  guardando = false;
  aviso = '';

  get categorias() { return this.tipo === 'gasto' ? this.datos.categoriasGasto : this.datos.categoriasIngreso; }
  cambiarTipo(tipo: Tipo): void { this.tipo = tipo; this.categoria = ''; }
  tecla(valor: string): void {
    this.monto = valor === '⌫' ? this.monto.slice(0, -1) : (this.monto + valor).slice(0, 9);
  }
  async guardar(): Promise<void> {
    const monto = Number(this.monto);
    const cuentaId = this.cuentaId || this.datos.cuentas[0]?.id;
    if (!monto || !this.categoria || !cuentaId) {
      this.aviso = 'Ingresa monto, categoría y una cuenta.';
      return;
    }
    this.guardando = true;
    try {
      await this.datos.agregarMovimiento(this.descripcion, this.categoria, monto, this.tipo, cuentaId);
      await this.router.navigateByUrl('/inicio');
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudo guardar el movimiento.';
    } finally {
      this.guardando = false;
      this.cambios.markForCheck();
    }
  }
}
