import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type Tipo = 'gasto' | 'ingreso';
type Cuenta = { id: string; nombre: string; tipo: string; saldo_inicial: number; color: string };
type MovimientoFila = { id: string; cuenta_id: string; nombre: string; categoria: string; monto: number; tipo: Tipo; fecha: string };
type Presupuesto = { categoria: string; limite: number };
type Meta = { id: string; nombre: string; objetivo: number; actual: number; vence: string | null; color: string; emoji: string };

@Injectable({ providedIn: 'root' })
export class FinanzasService {
  private supabase = inject(SupabaseService);
  private usuarioId = '';
  private cuentasBase: Cuenta[] = [];
  private movimientosBase: MovimientoFila[] = [];
  private limites: Presupuesto[] = [];
  metas: Meta[] = [];
  error = '';

  readonly categoriasGasto = [
    { nombre: 'Alimentación', emoji: '🛒', color: '#00d4aa', limite: 600000 },
    { nombre: 'Transporte', emoji: '🚗', color: '#ffb347', limite: 300000 },
    { nombre: 'Entretenimiento', emoji: '🎬', color: '#a78bfa', limite: 200000 },
    { nombre: 'Salud', emoji: '💊', color: '#ff5a7e', limite: 150000 },
    { nombre: 'Restaurantes', emoji: '🍽️', color: '#60a5fa', limite: 250000 },
    { nombre: 'Hogar', emoji: '🏠', color: '#34d399', limite: 400000 },
    { nombre: 'Ropa', emoji: '👕', color: '#f59e0b', limite: 200000 },
    { nombre: 'Otro', emoji: '📦', color: '#94a3b8', limite: 200000 },
  ];
  readonly categoriasIngreso = [
    { nombre: 'Trabajo', emoji: '💼' }, { nombre: 'Extra', emoji: '🎨' },
    { nombre: 'Inversiones', emoji: '📈' }, { nombre: 'Regalo', emoji: '🎁' },
    { nombre: 'Otro', emoji: '💸' },
  ];

  async cargar(usuarioId: string): Promise<void> {
    if (this.usuarioId === usuarioId) return;
    const db = this.supabase.cliente!;
    const [cuentas, movimientos, presupuestos, metas] = await Promise.all([
      db.from('cuentas').select('id,nombre,tipo,saldo_inicial,color').order('created_at'),
      db.from('movimientos').select('id,cuenta_id,nombre,categoria,monto,tipo,fecha').order('fecha', { ascending: false }),
      db.from('presupuestos').select('categoria,limite'),
      db.from('metas').select('id,nombre,objetivo,actual,vence,color,emoji').order('created_at'),
    ]);
    const error = cuentas.error || movimientos.error || presupuestos.error || metas.error;
    if (error) { this.error = error.message; throw error; }
    this.cuentasBase = cuentas.data as Cuenta[];
    this.movimientosBase = movimientos.data as MovimientoFila[];
    this.limites = presupuestos.data as Presupuesto[];
    this.metas = metas.data as Meta[];
    this.usuarioId = usuarioId;
    this.error = '';
  }

  limpiar(): void {
    this.usuarioId = '';
    this.cuentasBase = [];
    this.movimientosBase = [];
    this.limites = [];
    this.metas = [];
    this.error = '';
  }

  get cuentas() {
    return this.cuentasBase.map(cuenta => ({
      ...cuenta,
      saldo: cuenta.saldo_inicial + this.movimientosBase
        .filter(m => m.cuenta_id === cuenta.id)
        .reduce((total, m) => total + (m.tipo === 'ingreso' ? m.monto : -m.monto), 0),
    }));
  }
  get movimientos() {
    return this.movimientosBase.map(m => ({
      ...m,
      fechaTexto: new Date(m.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
      emoji: (m.tipo === 'gasto' ? this.categoriasGasto : this.categoriasIngreso)
        .find(c => c.nombre === m.categoria)?.emoji || '💰',
    }));
  }
  private get movimientosMes() {
    const hoy = new Date();
    return this.movimientosBase.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    });
  }
  get ingresos(): number { return this.movimientosMes.filter(m => m.tipo === 'ingreso').reduce((n, m) => n + m.monto, 0); }
  get gastos(): number { return this.movimientosMes.filter(m => m.tipo === 'gasto').reduce((n, m) => n + m.monto, 0); }
  get balance(): number { return this.cuentas.reduce((n, c) => n + c.saldo, 0); }
  get presupuestos() {
    return this.categoriasGasto.map(c => ({
      ...c,
      limite: this.limites.find(p => p.categoria === c.nombre)?.limite ?? c.limite,
      gastado: this.movimientosMes.filter(m => m.tipo === 'gasto' && m.categoria === c.nombre)
        .reduce((n, m) => n + m.monto, 0),
    }));
  }
  get meses() {
    const hoy = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - 5 + i, 1);
      const lista = this.movimientosBase.filter(m => {
        const fecha = new Date(m.fecha);
        return fecha.getMonth() === mes.getMonth() && fecha.getFullYear() === mes.getFullYear();
      });
      const total = (tipo: Tipo) => lista.filter(m => m.tipo === tipo).reduce((n, m) => n + m.monto, 0);
      return { nombre: mes.toLocaleDateString('es-CL', { month: 'short' }), ingreso: total('ingreso') / 1000000, gasto: total('gasto') / 1000000 };
    });
  }
  get escalaMeses(): number { return Math.max(1, ...this.meses.flatMap(m => [m.ingreso, m.gasto])); }
  get totalMetas(): number { return this.metas.reduce((n, m) => n + m.actual, 0); }
  get objetivoMetas(): number { return this.metas.reduce((n, m) => n + m.objetivo, 0); }
  get limiteTotal(): number { return this.presupuestos.reduce((n, p) => n + p.limite, 0); }
  get gastadoTotal(): number { return this.presupuestos.reduce((n, p) => n + p.gastado, 0); }

  dinero(monto: number): string { return (monto < 0 ? '-' : '') + '$' + Math.round(Math.abs(monto)).toLocaleString('es-CL'); }
  corto(monto: number): string {
    const signo = monto < 0 ? '-' : '';
    if (Math.abs(monto) >= 1000000) return signo + '$' + Number((Math.abs(monto) / 1000000).toFixed(2)) + 'M';
    if (Math.abs(monto) >= 1000) return signo + '$' + Math.round(Math.abs(monto) / 1000) + 'K';
    return this.dinero(monto);
  }
  porcentaje(actual: number, total: number): number {
    return total ? Math.max(0, Math.min(Math.round(actual / total * 100), 100)) : 0;
  }

  async agregarCuenta(nombre: string, tipo: string, saldo: number): Promise<void> {
    const colores = ['#00d4aa', '#ffb347', '#a78bfa', '#ff5a7e', '#60a5fa'];
    const { data, error } = await this.supabase.cliente!.from('cuentas').insert({
      usuario_id: this.usuarioId, nombre, tipo, saldo_inicial: saldo,
      color: colores[this.cuentasBase.length % colores.length],
    }).select('id,nombre,tipo,saldo_inicial,color').single();
    if (error) throw error;
    this.cuentasBase.push(data as Cuenta);
  }

  async agregarMovimiento(nombre: string, categoria: string, monto: number, tipo: Tipo, cuentaId: string): Promise<void> {
    const { data, error } = await this.supabase.cliente!.from('movimientos').insert({
      usuario_id: this.usuarioId, cuenta_id: cuentaId, nombre: nombre.trim() || categoria, categoria, monto, tipo,
    }).select('id,cuenta_id,nombre,categoria,monto,tipo,fecha').single();
    if (error) throw error;
    this.movimientosBase.unshift(data as MovimientoFila);
  }

  async guardarLimites(presupuestos: { nombre: string; limite: number }[]): Promise<void> {
    const filas = presupuestos.map(p => ({ usuario_id: this.usuarioId, categoria: p.nombre, limite: Number(p.limite) }));
    const { error } = await this.supabase.cliente!.from('presupuestos').upsert(filas, { onConflict: 'usuario_id,categoria' });
    if (error) throw error;
    this.limites = filas;
  }

  async agregarMeta(nombre: string, objetivo: number, vence: string | null): Promise<void> {
    const { data, error } = await this.supabase.cliente!.from('metas').insert({
      usuario_id: this.usuarioId, nombre, objetivo, vence,
    }).select('id,nombre,objetivo,actual,vence,color,emoji').single();
    if (error) throw error;
    this.metas.push(data as Meta);
  }

  async abonarMeta(meta: Meta, monto: number): Promise<void> {
    const { data, error } = await this.supabase.cliente!.from('metas')
      .update({ actual: meta.actual + monto }).eq('id', meta.id)
      .select('id,nombre,objetivo,actual,vence,color,emoji').single();
    if (error) throw error;
    this.metas = this.metas.map(m => m.id === meta.id ? data as Meta : m);
  }
}
