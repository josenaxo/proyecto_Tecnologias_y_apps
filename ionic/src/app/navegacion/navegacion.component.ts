import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonFooter, IonTabBar } from '@ionic/angular';

@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, RouterLinkActive, IonFooter, IonTabBar],
  templateUrl: 'navegacion.component.html',
  styleUrls: ['navegacion.component.scss'],
})
export class NavegacionComponent {}
