import { Component, HostBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent,
  IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption,
  IonTabBar, IonTabButton, IonTitle, IonToast, IonToggle, IonToolbar
} from '@ionic/angular';

type Pagina = 'inicio' | 'movimientos' | 'cuentas' | 'nuevo' | 'metas' | 'analisis' | 'presupuesto' | 'perfil' | 'bienvenida';
type Tipo = 'gasto' | 'ingreso';
interface Movimiento { nombre: string; categoria: string; fecha: string; monto: number; tipo: Tipo; emoji: string; }

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule, IonButton, IonButtons, IonCard, IonCardContent, IonCol,
    IonContent, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList,
    IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonSelect,
    IonSelectOption, IonTabBar, IonTabButton, IonTitle, IonToast,
    IonToggle, IonToolbar
  ],
})
export class HomePage {
  @HostBinding('class.claro') get claro(): boolean { return !this.modoOscuro; }
  pagina: Pagina = 'inicio';
  mostrarSaldo = true;
  modoOscuro = true;
  notificaciones = true;
  aviso = '';
  filtro: 'todos' | Tipo = 'todos';
  busqueda = '';
  pasoBienvenida = 0;

  cuentas = [
    { nombre: 'Banco de Chile Ahorro', detalle: 'Ahorro · ****4521', saldo: 4300000, emoji: '🏦' },
    { nombre: 'Santander Corriente', detalle: 'Corriente · ****8834', saldo: 1800000, emoji: '💳' },
    { nombre: 'Mach', detalle: 'Digital · ****2291', saldo: 380000, emoji: '📱' },
    { nombre: 'Portafolio ETF', detalle: 'Inversiones', saldo: 8700000, emoji: '📈' },
  ];
  movimientos: Movimiento[] = [
    { nombre: 'Supermercado Jumbo', categoria: 'Alimentación', fecha: '30 ago', monto: 385000, tipo: 'gasto', emoji: '🛒' },
    { nombre: 'Salario Agosto', categoria: 'Trabajo', fecha: '29 ago', monto: 3500000, tipo: 'ingreso', emoji: '💼' },
    { nombre: 'Netflix y cine', categoria: 'Entretenimiento', fecha: '28 ago', monto: 188000, tipo: 'gasto', emoji: '🎬' },
    { nombre: 'Gasolina Copec', categoria: 'Transporte', fecha: '27 ago', monto: 215000, tipo: 'gasto', emoji: '🚗' },
    { nombre: 'Freelance diseño', categoria: 'Extra', fecha: '26 ago', monto: 450000, tipo: 'ingreso', emoji: '🎨' },
    { nombre: 'Restaurantes', categoria: 'Restaurantes', fecha: '25 ago', monto: 195000, tipo: 'gasto', emoji: '🍽️' },
    { nombre: 'Farmacia', categoria: 'Salud', fecha: '23 ago', monto: 85000, tipo: 'gasto', emoji: '💊' },
    { nombre: 'Dividendos ETF', categoria: 'Inversiones', fecha: '22 ago', monto: 125000, tipo: 'ingreso', emoji: '📈' },
    { nombre: 'Hogar', categoria: 'Hogar', fecha: '21 ago', monto: 120000, tipo: 'gasto', emoji: '🏠' },
  ];
  presupuestos = [
    { categoria: 'Alimentación', limite: 600000, emoji: '🛒' },
    { categoria: 'Transporte', limite: 300000, emoji: '🚗' },
    { categoria: 'Entretenimiento', limite: 200000, emoji: '🎬' },
    { categoria: 'Salud', limite: 150000, emoji: '💊' },
    { categoria: 'Restaurantes', limite: 250000, emoji: '🍽️' },
    { categoria: 'Hogar', limite: 400000, emoji: '🏠' },
  ];
  metas = [
    { nombre: 'Viaje a Europa', actual: 4800000, objetivo: 12000000, vence: 'Jun 2027', emoji: '✈️' },
    { nombre: 'Fondo de emergencia', actual: 5100000, objetivo: 6000000, vence: 'Dic 2026', emoji: '🛡️' },
    { nombre: 'MacBook Pro', actual: 2900000, objetivo: 9500000, vence: 'Mar 2027', emoji: '💻' },
    { nombre: 'Cursos de inglés', actual: 900000, objetivo: 1800000, vence: 'Nov 2026', emoji: '📚' },
  ];
  categoriasGasto = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Restaurantes', 'Hogar', 'Ropa', 'Otro'];
  categoriasIngreso = ['Trabajo', 'Extra', 'Inversiones', 'Regalo', 'Otro'];
  nuevoTipo: Tipo = 'gasto';
  nuevoNombre = '';
  nuevoMonto: number | null = null;
  nuevaCategoria = '';
  nuevaCuenta = 0;
  nuevaMetaNombre = '';
  nuevaMetaObjetivo: number | null = null;
  metaParaAbonar = -1;
  montoAbono: number | null = null;
  editarPresupuestos = false;
  bienvenida = [
    { emoji: '📊', titulo: 'Visión clara de tu dinero', texto: 'Ingresos y gastos en un solo lugar.' },
    { emoji: '🎯', titulo: 'Alcanza tus metas', texto: 'Define objetivos y sigue tu avance.' },
    { emoji: '💡', titulo: 'Decide con información', texto: 'Revisa tus movimientos y presupuesto.' },
  ];

  get balance(): number { return this.cuentas.reduce((t, c) => t + c.saldo, 0); }
  get ingresos(): number { return this.totalPorTipo('ingreso'); }
  get gastos(): number { return this.totalPorTipo('gasto'); }
  get totalMetas(): number { return this.metas.reduce((t, m) => t + m.actual, 0); }
  get objetivoMetas(): number { return this.metas.reduce((t, m) => t + m.objetivo, 0); }
  get limiteTotal(): number { return this.presupuestos.reduce((t, p) => t + p.limite, 0); }
  get movimientosFiltrados(): Movimiento[] {
    return this.movimientos.filter((m) =>
      (this.filtro === 'todos' || m.tipo === this.filtro) &&
      (m.nombre + ' ' + m.categoria).toLowerCase().includes(this.busqueda.toLowerCase()));
  }

  ir(pagina: Pagina): void {
    this.pagina = pagina;
    this.aviso = '';
    document.querySelector('ion-content')?.scrollToTop();
  }
  dinero(monto: number): string { return '$' + Math.round(monto).toLocaleString('es-CL'); }
  porcentaje(actual: number, total: number): number { return total ? Math.min(actual / total, 1) : 0; }
  totalPorTipo(tipo: Tipo): number {
    return this.movimientos.filter((m) => m.tipo === tipo).reduce((t, m) => t + m.monto, 0);
  }
  gastadoEn(categoria: string): number {
    return this.movimientos.filter((m) => m.tipo === 'gasto' && m.categoria === categoria)
      .reduce((t, m) => t + m.monto, 0);
  }
  emojiCategoria(categoria: string): string {
    return this.presupuestos.find((p) => p.categoria === categoria)?.emoji || '💰';
  }
  cambiarTipo(tipo: Tipo): void { this.nuevoTipo = tipo; this.nuevaCategoria = ''; }

  guardarMovimiento(): void {
    if (!this.nuevoNombre.trim() || !this.nuevoMonto || this.nuevoMonto <= 0 || !this.nuevaCategoria) {
      this.aviso = 'Completa nombre, monto y categoría.';
      return;
    }
    const monto = Number(this.nuevoMonto);
    this.movimientos.unshift({
      nombre: this.nuevoNombre.trim(), categoria: this.nuevaCategoria,
      fecha: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
      monto, tipo: this.nuevoTipo, emoji: this.emojiCategoria(this.nuevaCategoria)
    });
    this.cuentas[this.nuevaCuenta].saldo += this.nuevoTipo === 'ingreso' ? monto : -monto;
    this.nuevoNombre = '';
    this.nuevoMonto = null;
    this.nuevaCategoria = '';
    this.ir('movimientos');
    this.aviso = 'Movimiento agregado a esta demostración.';
  }
  guardarMeta(): void {
    if (!this.nuevaMetaNombre.trim() || !this.nuevaMetaObjetivo || this.nuevaMetaObjetivo <= 0) {
      this.aviso = 'Escribe un nombre y un objetivo mayor que cero.';
      return;
    }
    this.metas.push({ nombre: this.nuevaMetaNombre.trim(), actual: 0,
      objetivo: Number(this.nuevaMetaObjetivo), vence: 'Sin fecha', emoji: '🎯' });
    this.nuevaMetaNombre = '';
    this.nuevaMetaObjetivo = null;
    this.aviso = 'Meta agregada a esta demostración.';
  }
  abonarMeta(): void {
    if (this.metaParaAbonar < 0 || !this.montoAbono || this.montoAbono <= 0) {
      this.aviso = 'Ingresa un abono mayor que cero.';
      return;
    }
    this.metas[this.metaParaAbonar].actual += Number(this.montoAbono);
    this.metaParaAbonar = -1;
    this.montoAbono = null;
    this.aviso = 'Abono agregado a esta demostración.';
  }
  exportarCSV(): void {
    const filas = ['Nombre;Categoría;Fecha;Tipo;Monto', ...this.movimientos.map((m) =>
      [m.nombre, m.categoria, m.fecha, m.tipo, m.monto].join(';'))];
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(new Blob(['\uFEFF' + filas.join('\n')], { type: 'text/csv;charset=utf-8' }));
    enlace.download = 'finsight-movimientos.csv';
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }
}
