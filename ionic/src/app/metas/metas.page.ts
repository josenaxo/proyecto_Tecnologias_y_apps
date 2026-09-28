import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonToast } from '@ionic/angular';
import { FinanzasService } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-metas',
  templateUrl: 'metas.page.html',
  styleUrls: ['metas.page.scss'],
  imports: [FormsModule, IonContent, IonInput, IonToast, NavegacionComponent],
})
export class MetasPage {
  datos = inject(FinanzasService);
  private cambios = inject(ChangeDetectorRef);
  mostrarFormulario = false;
  nombre = '';
  objetivo: number | null = null;
  vence = '';
  metaActiva = '';
  abono: number | null = null;
  guardando = false;
  aviso = '';

  async guardar(): Promise<void> {
    if (!this.nombre.trim() || !this.objetivo || this.objetivo <= 0) {
      this.aviso = 'Escribe el nombre y un objetivo mayor que cero.';
      return;
    }
    this.guardando = true;
    try {
      await this.datos.agregarMeta(this.nombre.trim(), Number(this.objetivo), this.vence || null);
      this.nombre = '';
      this.objetivo = null;
      this.vence = '';
      this.mostrarFormulario = false;
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudo guardar la meta.';
    } finally {
      this.guardando = false;
      this.cambios.markForCheck();
    }
  }

  async abonar(meta: (typeof this.datos.metas)[number]): Promise<void> {
    if (!this.abono || this.abono <= 0 || meta.actual + Number(this.abono) > meta.objetivo) {
      this.aviso = 'El abono debe ser mayor que cero y no superar el objetivo.';
      return;
    }
    this.guardando = true;
    try {
      await this.datos.abonarMeta(meta, Number(this.abono));
      this.metaActiva = '';
      this.abono = null;
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudo guardar el abono.';
    } finally {
      this.guardando = false;
      this.cambios.markForCheck();
    }
  }
}
