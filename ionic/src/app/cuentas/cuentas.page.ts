import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonToast } from '@ionic/angular';
import { FinanzasService } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-cuentas',
  templateUrl: 'cuentas.page.html',
  styleUrls: ['cuentas.page.scss'],
  imports: [FormsModule, RouterLink, IonContent, IonInput, IonToast, NavegacionComponent],
})
export class CuentasPage {
  datos = inject(FinanzasService);
  private cambios = inject(ChangeDetectorRef);
  private ruta = inject(ActivatedRoute);
  mostrarPresupuesto = false;
  editarPresupuesto = false;
  mostrarCuenta = false;
  guardando = false;
  limitesEditables: { nombre: string; limite: number }[] = [];
  nombre = '';
  tipo = 'Cuenta corriente';
  saldo: number | null = null;
  aviso = '';

  constructor() {
    this.ruta.queryParamMap.subscribe(parametros => {
      this.mostrarPresupuesto = parametros.has('presupuesto');
    });
  }

  get graficoCuentas(): string {
    const cuentas = this.datos.cuentas;
    const total = cuentas.reduce((n, c) => n + Math.max(c.saldo, 0), 0);
    if (!total) return 'rgba(255,255,255,.08)';
    let porcentaje = 0;
    const tramos = cuentas.map(c => {
      const inicio = porcentaje;
      porcentaje += Math.max(c.saldo, 0) / total * 100;
      return `${c.color} ${inicio}% ${porcentaje}%`;
    });
    return `conic-gradient(${tramos.join(', ')})`;
  }

  async alternarEdicion(): Promise<void> {
    if (!this.editarPresupuesto) {
      this.limitesEditables = this.datos.presupuestos.map(p => ({ nombre: p.nombre, limite: p.limite }));
      this.editarPresupuesto = true;
      return;
    }
    if (this.limitesEditables.some(p => !Number.isFinite(Number(p.limite)) || Number(p.limite) < 0)) {
      this.aviso = 'Los límites deben ser cero o mayores.';
      return;
    }
    this.guardando = true;
    try {
      await this.datos.guardarLimites(this.limitesEditables);
      this.editarPresupuesto = false;
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudieron guardar los límites.';
    } finally {
      this.guardando = false;
      this.cambios.markForCheck();
    }
  }

  async agregarCuenta(): Promise<void> {
    if (!this.nombre.trim() || this.saldo === null || !Number.isFinite(Number(this.saldo))) {
      this.aviso = 'Escribe el nombre y el saldo inicial de la cuenta.';
      return;
    }
    this.guardando = true;
    try {
      await this.datos.agregarCuenta(this.nombre.trim(), this.tipo, Number(this.saldo));
      this.nombre = '';
      this.saldo = null;
      this.mostrarCuenta = false;
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudo crear la cuenta.';
    } finally {
      this.guardando = false;
      this.cambios.markForCheck();
    }
  }
}
