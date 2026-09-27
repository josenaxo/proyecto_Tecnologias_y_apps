import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonToast } from '@ionic/angular';
import { FinanzasService } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  imports: [RouterLink, IonContent, IonToast, NavegacionComponent],
})
export class PerfilPage {
  datos = inject(FinanzasService);
  aviso = '';
}
