import { Routes } from '@angular/router';
import { requiereSesion } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  { path: 'bienvenida', loadComponent: () => import('./bienvenida/bienvenida.page').then(m => m.BienvenidaPage) },
  { path: 'inicio', canActivate: [requiereSesion], loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
  { path: 'cuentas', canActivate: [requiereSesion], loadComponent: () => import('./cuentas/cuentas.page').then(m => m.CuentasPage) },
  { path: 'cuentas/:id', canActivate: [requiereSesion], loadComponent: () => import ('./detalle-cuenta/detalle-cuenta.page').then(m => m.DetalleCuentaPage)},
  { path: 'nuevo', canActivate: [requiereSesion], loadComponent: () => import('./nuevo/nuevo.page').then(m => m.NuevoPage) },
  { path: 'metas', canActivate: [requiereSesion], loadComponent: () => import('./metas/metas.page').then(m => m.MetasPage) },
  { path: 'perfil', canActivate: [requiereSesion], loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage) },
  { path: 'home', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'bienvenida' },
  
];
