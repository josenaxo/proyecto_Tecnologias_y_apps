import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  { path: 'bienvenida', loadComponent: () => import('./bienvenida/bienvenida.page').then(m => m.BienvenidaPage) },
  { path: 'inicio', loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
  { path: 'cuentas', loadComponent: () => import('./cuentas/cuentas.page').then(m => m.CuentasPage) },
  { path: 'nuevo', loadComponent: () => import('./nuevo/nuevo.page').then(m => m.NuevoPage) },
  { path: 'metas', loadComponent: () => import('./metas/metas.page').then(m => m.MetasPage) },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage) },
  { path: 'home', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'bienvenida' },
];
