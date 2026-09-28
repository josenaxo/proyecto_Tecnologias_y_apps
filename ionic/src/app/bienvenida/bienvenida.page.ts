import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: 'bienvenida.page.html',
  styleUrls: ['bienvenida.page.scss'],
  imports: [FormsModule, IonContent],
})
export class BienvenidaPage {
  supabase = inject(SupabaseService);
  private router = inject(Router);
  private cambios = inject(ChangeDetectorRef);
  paso = 0;
  email = '';
  password = '';
  registro = false;
  cargando = false;
  aviso = '';
  slides = [
    { emoji: '📊', titulo: 'Visión clara de tu dinero', texto: 'Todos tus ingresos y gastos en un solo lugar, presentados de forma simple e intuitiva.' },
    { emoji: '🎯', titulo: 'Alcanza tus metas', texto: 'Define objetivos de ahorro y sigue tu progreso paso a paso hasta lograrlos.' },
    { emoji: '💡', titulo: 'Tus datos, en tu cuenta', texto: 'Entra para guardar tus cuentas, movimientos y metas de forma segura.' },
  ];

  async autenticar(): Promise<void> {
    if (!this.email.trim() || this.password.length < 6) {
      this.aviso = 'Escribe un correo y una contraseña de al menos 6 caracteres.';
      return;
    }
    this.cargando = true;
    this.aviso = '';
    try {
      if (this.registro) {
        const sesionIniciada = await this.supabase.registrar(this.email.trim(), this.password);
        if (!sesionIniciada) {
          this.aviso = 'Revisa tu correo para confirmar la cuenta y luego inicia sesión.';
          this.registro = false;
          return;
        }
      } else {
        await this.supabase.entrar(this.email.trim(), this.password);
      }
      await this.router.navigateByUrl('/inicio');
    } catch (error) {
      const codigo = (error as { code?: string })?.code;
      const mensajes: Record<string, string> = {
        over_email_send_rate_limit: 'Espera antes de pedir otro correo de confirmación.',
        email_not_confirmed: 'Confirma tu correo antes de iniciar sesión.',
        invalid_credentials: 'Correo o contraseña incorrectos.',
      };
      this.aviso = mensajes[codigo || ''] || (error instanceof Error ? error.message : 'No se pudo conectar con Supabase.');
    } finally {
      this.cargando = false;
      this.cambios.markForCheck();
    }
  }
}
