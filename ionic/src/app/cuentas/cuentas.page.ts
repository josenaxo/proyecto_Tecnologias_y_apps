import { Component, inject } from '@angular/core';
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
  private ruta = inject(ActivatedRoute);
  mostrarPresupuesto = false;
  editarPresupuesto = false;
  aviso = '';

  constructor() {
    this.ruta.queryParamMap.subscribe(parametros => {
      this.mostrarPresupuesto = parametros.has('presupuesto');
    });
  }
}
