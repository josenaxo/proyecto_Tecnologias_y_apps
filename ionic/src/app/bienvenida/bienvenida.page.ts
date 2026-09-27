import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.page.html',
  styleUrls: ['bienvenida.page.scss'],
  imports: [IonContent, RouterLink],
})
export class BienvenidaPage {
  paso = 0;
  slides = [
    { emoji: '📊', titulo: 'Visión clara de tu dinero', texto: 'Todos tus ingresos y gastos en un solo lugar, presentados de forma simple e intuitiva.' },
    { emoji: '🎯', titulo: 'Alcanza tus metas', texto: 'Define objetivos de ahorro y sigue tu progreso paso a paso hasta lograrlos.' },
    { emoji: '💡', titulo: 'Decisiones más inteligentes', texto: 'Analiza tus hábitos financieros y descubre oportunidades de mejora cada mes.' },
  ];
}
