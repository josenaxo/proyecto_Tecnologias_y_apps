import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FinanzasService } from './finanzas.service';
import { SupabaseService } from './supabase.service';

export const requiereSesion: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const finanzas = inject(FinanzasService);
  const router = inject(Router);
  const usuario = await supabase.usuario();
  if (!usuario) return router.createUrlTree(['/bienvenida']);
  try { await finanzas.cargar(usuario.id); }
  catch { return true; }
  return true;
};
