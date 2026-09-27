import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFooter, IonInput, IonTabBar, IonToast } from '@ionic/angular';

type Pagina = 'bienvenida' | 'inicio' | 'movimientos' | 'cuentas' | 'nuevo' | 'metas' | 'analisis' | 'presupuesto' | 'perfil';
type Tipo = 'gasto' | 'ingreso';
type Movimiento = { nombre: string; categoria: string; monto: number; fecha: string; tipo: Tipo; emoji: string };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonContent, IonFooter, IonInput, IonTabBar, IonToast],
})
export class HomePage {
  @ViewChild(IonContent) contenido?: IonContent;
  pagina: Pagina = 'bienvenida';
  paso = 0;
  mostrarSaldo = true;
  filtro: 'todos' | Tipo = 'todos';
  busqueda = '';
  periodo: '3m' | '6m' = '6m';
  aviso = '';
  nuevoTipo: Tipo = 'gasto';
  nuevoMonto = '';
  nuevaCategoria = '';
  nuevaDescripcion = '';
  nuevaMeta = '';
  nuevoObjetivo: number | null = null;
  mostrarNuevaMeta = false;
  editarPresupuesto = false;

  bienvenida = [
    { emoji: '📊', titulo: 'Visión clara de tu dinero', texto: 'Todos tus ingresos y gastos en un solo lugar, presentados de forma simple e intuitiva.' },
    { emoji: '🎯', titulo: 'Alcanza tus metas', texto: 'Define objetivos de ahorro y sigue tu progreso paso a paso hasta lograrlos.' },
    { emoji: '💡', titulo: 'Decisiones más inteligentes', texto: 'Analiza tus hábitos financieros y descubre oportunidades de mejora cada mes.' },
  ];
  cuentas = [
    { nombre: 'Banco de Chile Ahorro', tipo: 'Cuenta de Ahorro', saldo: 4250000, color: '#00d4aa', ultimos: '4521' },
    { nombre: 'Santander Corriente', tipo: 'Cuenta Corriente', saldo: 1820000, color: '#ffb347', ultimos: '8834' },
    { nombre: 'Mach', tipo: 'Cuenta Digital', saldo: 380000, color: '#a78bfa', ultimos: '2291' },
    { nombre: 'Portafolio ETF', tipo: 'Inversiones', saldo: 8650000, color: '#ff5a7e', ultimos: '—' },
  ];
  movimientos: Movimiento[] = [
    { nombre: 'Supermercado Jumbo', categoria: 'Alimentación', monto: 85000, fecha: '30 Ago', tipo: 'gasto', emoji: '🛒' },
    { nombre: 'Salario Agosto', categoria: 'Trabajo', monto: 3500000, fecha: '29 Ago', tipo: 'ingreso', emoji: '💼' },
    { nombre: 'Netflix', categoria: 'Entretenimiento', monto: 22900, fecha: '28 Ago', tipo: 'gasto', emoji: '🎬' },
    { nombre: 'Gasolina Copec', categoria: 'Transporte', monto: 65000, fecha: '27 Ago', tipo: 'gasto', emoji: '⛽' },
    { nombre: 'Freelance diseño', categoria: 'Extra', monto: 450000, fecha: '26 Ago', tipo: 'ingreso', emoji: '🎨' },
    { nombre: 'Restaurant El Hoyo', categoria: 'Restaurantes', monto: 45000, fecha: '25 Ago', tipo: 'gasto', emoji: '🍽️' },
    { nombre: 'Spotify Premium', categoria: 'Entretenimiento', monto: 12900, fecha: '24 Ago', tipo: 'gasto', emoji: '🎵' },
    { nombre: 'Farmacia Cruz Verde', categoria: 'Salud', monto: 28500, fecha: '23 Ago', tipo: 'gasto', emoji: '💊' },
    { nombre: 'Dividendos ETF', categoria: 'Inversiones', monto: 125000, fecha: '22 Ago', tipo: 'ingreso', emoji: '📈' },
    { nombre: 'Ropa Zara', categoria: 'Ropa', monto: 189000, fecha: '21 Ago', tipo: 'gasto', emoji: '👕' },
  ];
  presupuestos = [
    { nombre: 'Alimentación', limite: 600000, gastado: 385000, color: '#00d4aa', emoji: '🛒' },
    { nombre: 'Transporte', limite: 300000, gastado: 215000, color: '#ffb347', emoji: '🚗' },
    { nombre: 'Entretenimiento', limite: 200000, gastado: 188000, color: '#a78bfa', emoji: '🎬' },
    { nombre: 'Salud', limite: 150000, gastado: 85000, color: '#ff5a7e', emoji: '💊' },
    { nombre: 'Restaurantes', limite: 250000, gastado: 195000, color: '#60a5fa', emoji: '🍽️' },
    { nombre: 'Hogar', limite: 400000, gastado: 120000, color: '#34d399', emoji: '🏠' },
  ];
  metas = [
    { nombre: 'Viaje a Europa', objetivo: 12000000, actual: 4800000, vence: 'Jun 2027', color: '#00d4aa', emoji: '✈️' },
    { nombre: 'Fondo de Emergencia', objetivo: 6000000, actual: 5100000, vence: 'Dic 2026', color: '#ffb347', emoji: '🛡️' },
    { nombre: 'MacBook Pro M4', objetivo: 9500000, actual: 2850000, vence: 'Mar 2027', color: '#a78bfa', emoji: '💻' },
    { nombre: 'Cursos de Inglés', objetivo: 1800000, actual: 900000, vence: 'Nov 2026', color: '#ff5a7e', emoji: '📚' },
  ];
  categoriasGasto = [
    { nombre: 'Alimentación', emoji: '🛒' }, { nombre: 'Transporte', emoji: '🚗' },
    { nombre: 'Entretenimiento', emoji: '🎬' }, { nombre: 'Salud', emoji: '💊' },
    { nombre: 'Restaurantes', emoji: '🍽️' }, { nombre: 'Hogar', emoji: '🏠' },
    { nombre: 'Ropa', emoji: '👕' }, { nombre: 'Otro', emoji: '📦' },
  ];
  categoriasIngreso = [
    { nombre: 'Trabajo', emoji: '💼' }, { nombre: 'Extra', emoji: '🎨' },
    { nombre: 'Inversiones', emoji: '📈' }, { nombre: 'Regalo', emoji: '🎁' },
    { nombre: 'Otro', emoji: '💸' },
  ];
  meses = [
    { nombre: 'Mar', ingreso: 3.5, gasto: 1.8 }, { nombre: 'Abr', ingreso: 3.5, gasto: 2.1 },
    { nombre: 'May', ingreso: 3.95, gasto: 1.95 }, { nombre: 'Jun', ingreso: 3.5, gasto: 2.3 },
    { nombre: 'Jul', ingreso: 4, gasto: 1.7 }, { nombre: 'Ago', ingreso: 3.95, gasto: 2.16 },
  ];

  ingresos = 4070000;
  gastos = 2160000;
  get balance(): number { return this.cuentas.reduce((total, c) => total + c.saldo, 0); }
  get totalMetas(): number { return this.metas.reduce((total, m) => total + m.actual, 0); }
  get objetivoMetas(): number { return this.metas.reduce((total, m) => total + m.objetivo, 0); }
  get limiteTotal(): number { return this.presupuestos.reduce((total, p) => total + p.limite, 0); }
  get gastadoTotal(): number { return this.presupuestos.reduce((total, p) => total + p.gastado, 0); }
  get movimientosFiltrados(): Movimiento[] {
    return this.movimientos.filter(m =>
      (this.filtro === 'todos' || m.tipo === this.filtro) &&
      (m.nombre + ' ' + m.categoria).toLowerCase().includes(this.busqueda.toLowerCase()));
  }
  get mesesVisibles() { return this.periodo === '3m' ? this.meses.slice(-3) : this.meses; }

  ir(pagina: Pagina): void {
    this.pagina = pagina;
    this.aviso = '';
    this.contenido?.scrollToTop(0);
  }
  dinero(monto: number): string { return '$' + Math.round(monto).toLocaleString('es-CL'); }
  corto(monto: number): string {
    if (monto >= 1000000) return '$' + Number((monto / 1000000).toFixed(2)) + 'M';
    if (monto >= 1000) return '$' + Math.round(monto / 1000) + 'K';
    return this.dinero(monto);
  }
  porcentaje(actual: number, total: number): number { return total ? Math.min(Math.round(actual / total * 100), 100) : 0; }
  tecla(valor: string): void {
    this.nuevoMonto = valor === '⌫' ? this.nuevoMonto.slice(0, -1) : (this.nuevoMonto + valor).slice(0, 9);
  }
  cambiarTipo(tipo: Tipo): void { this.nuevoTipo = tipo; this.nuevaCategoria = ''; }
  guardarMovimiento(): void {
    const monto = Number(this.nuevoMonto);
    if (!monto || !this.nuevaCategoria) { this.aviso = 'Ingresa un monto y selecciona una categoría.'; return; }
    const categorias = this.nuevoTipo === 'gasto' ? this.categoriasGasto : this.categoriasIngreso;
    const categoria = categorias.find(c => c.nombre === this.nuevaCategoria)!;
    this.movimientos.unshift({
      nombre: this.nuevaDescripcion.trim() || this.nuevaCategoria, categoria: this.nuevaCategoria,
      monto, tipo: this.nuevoTipo, emoji: categoria.emoji,
      fecha: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
    });
    this.cuentas[0].saldo += this.nuevoTipo === 'ingreso' ? monto : -monto;
    if (this.nuevoTipo === 'ingreso') this.ingresos += monto;
    else {
      this.gastos += monto;
      const presupuesto = this.presupuestos.find(p => p.nombre === this.nuevaCategoria);
      if (presupuesto) presupuesto.gastado += monto;
    }
    this.nuevoMonto = ''; this.nuevaCategoria = ''; this.nuevaDescripcion = '';
    this.ir('movimientos');
    this.aviso = 'Movimiento guardado en esta demostración.';
  }
  guardarMeta(): void {
    if (!this.nuevaMeta.trim() || !this.nuevoObjetivo || this.nuevoObjetivo <= 0) {
      this.aviso = 'Escribe el nombre y un objetivo mayor que cero.'; return;
    }
    this.metas.push({ nombre: this.nuevaMeta.trim(), objetivo: Number(this.nuevoObjetivo), actual: 0,
      vence: 'Sin fecha', color: '#00d4aa', emoji: '🎯' });
    this.nuevaMeta = ''; this.nuevoObjetivo = null; this.mostrarNuevaMeta = false;
  }
}
