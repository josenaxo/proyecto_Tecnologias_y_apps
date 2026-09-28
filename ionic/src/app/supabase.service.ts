import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly configurado = Boolean(environment.supabaseUrl && environment.supabaseKey);
  readonly cliente: SupabaseClient | null = this.configurado
    ? createClient(environment.supabaseUrl, environment.supabaseKey)
    : null;

  async usuario(): Promise<User | null> {
    if (!this.cliente) return null;
    const { data, error } = await this.cliente.auth.getUser();
    if (error) return null;
    return data.user;
  }

  async entrar(email: string, password: string): Promise<void> {
    const { error } = await this.cliente!.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async registrar(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.cliente!.auth.signUp({ email, password });
    if (error) throw error;
    return Boolean(data.session);
  }

  async salir(): Promise<void> {
    const { error } = await this.cliente!.auth.signOut();
    if (error) throw error;
  }
}
