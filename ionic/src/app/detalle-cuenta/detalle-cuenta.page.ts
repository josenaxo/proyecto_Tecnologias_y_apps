import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { FinanzasService } from '../finanzas.service';

@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
  imports: [RouterLink, IonContent, NavegacionComponent]
})

export class DetalleCuentaPage  {
  datos = inject(FinanzasService)
  private ruta = inject(ActivatedRoute)
  id = this.ruta.snapshot.paramMap.get('id') ?? '';

  get cuenta() {
    return this.datos.cuentas.find(c => c.id === this.id)
  }
  get movimientos() {
    return this.datos.movimientos.filter(m => m.cuenta_id === this.id)
  }
  get entradas(): number{
    return this.movimientos.filter(m => m.tipo === "ingreso").reduce((total,m) => total + m.monto, 0)
  }
  get salidas(): number {
    return this.movimientos.filter(m => m.tipo === "gasto").reduce((total,m) => total + m.monto, 0)
  }


  

}
