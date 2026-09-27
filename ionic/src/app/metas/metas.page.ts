import { Component, inject } from '@angular/core';
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
  mostrarFormulario = false;
  nombre = '';
  objetivo: number | null = null;
  aviso = '';

  guardar(): void {
    if (!this.nombre.trim() || !this.objetivo || this.objetivo <= 0) {
      this.aviso = 'Escribe el nombre y un objetivo mayor que cero.';
      return;
    }
    this.datos.metas.push({
      nombre: this.nombre.trim(), objetivo: Number(this.objetivo), actual: 0,
      vence: 'Sin fecha', color: '#00d4aa', emoji: '🎯',
    });
    this.nombre = '';
    this.objetivo = null;
    this.mostrarFormulario = false;
  }
}
