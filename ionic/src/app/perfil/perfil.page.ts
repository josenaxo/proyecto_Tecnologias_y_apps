import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonToast } from '@ionic/angular';
import { FinanzasService } from '../finanzas.service';
import { NavegacionComponent } from '../navegacion/navegacion.component';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  imports: [RouterLink, IonContent, IonToast, NavegacionComponent],
})
export class PerfilPage implements OnInit {
  datos = inject(FinanzasService);
  private cambios = inject(ChangeDetectorRef);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  email = '';
  aviso = '';

  async ngOnInit(): Promise<void> {
    this.email = (await this.supabase.usuario())?.email || '';
    this.cambios.markForCheck();
  }

  async salir(): Promise<void> {
    try {
      await this.supabase.salir();
      this.datos.limpiar();
      await this.router.navigateByUrl('/bienvenida');
    } catch (error) {
      this.aviso = error instanceof Error ? error.message : 'No se pudo cerrar sesión.';
      this.cambios.markForCheck();
    }
  }
}
