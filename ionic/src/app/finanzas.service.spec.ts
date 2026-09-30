import { TestBed } from '@angular/core/testing';
import { FinanzasService } from './finanzas.service';
import { SupabaseService } from './supabase.service';

describe('FinanzasService', () => {
  const filas: Record<string, object[]> = {
    cuentas: [
      { id: 'cuenta-a', nombre: 'Ahorro', tipo: 'Cuenta', saldo_inicial: 1000, color: '#000' },
      { id: 'cuenta-b', nombre: 'Otra', tipo: 'Cuenta', saldo_inicial: 5000, color: '#fff' },
    ],
    movimientos: [
      { id: 'anterior', cuenta_id: 'cuenta-a', nombre: 'Compra', categoria: 'Otro', monto: 400, tipo: 'gasto', fecha: '2026-09-30' },
    ],
    presupuestos: [],
    metas: [],
  };
  let servicio: FinanzasService;
  let inserciones: { tabla: string; fila: Record<string, unknown> }[];

  beforeEach(async () => {
    inserciones = [];
    const cliente = {
      from: (tabla: string) => ({
        select: () => Object.assign(Promise.resolve({ data: filas[tabla], error: null }), {
          order: () => Promise.resolve({ data: filas[tabla], error: null }),
        }),
        insert: (fila: Record<string, unknown>) => {
          inserciones.push({ tabla, fila });
          return {
            select: () => ({
              single: async () => ({
                data: { id: 'nuevo', fecha: '2026-09-30', ...fila },
                error: null,
              }),
            }),
          };
        },
      }),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: { cliente } }],
    });
    servicio = TestBed.inject(FinanzasService);
    await servicio.cargar('usuario');
  });

  it('rechaza un gasto mayor al saldo de la cuenta elegida', async () => {
    await expect(servicio.agregarMovimiento('Compra', 'Otro', 601, 'gasto', 'cuenta-a'))
      .rejects.toThrow('Saldo insuficiente en Ahorro. Disponible: $600.');
    expect(inserciones).toHaveLength(0);
  });

  it('permite gastar exactamente el saldo disponible', async () => {
    await servicio.agregarMovimiento('Compra', 'Otro', 600, 'gasto', 'cuenta-a');
    expect(inserciones).toHaveLength(1);
    expect(servicio.cuentas.find(c => c.id === 'cuenta-a')?.saldo).toBe(0);
  });

  it('permite ingresos y rechaza saldos iniciales negativos', async () => {
    await servicio.agregarMovimiento('Sueldo', 'Trabajo', 6000, 'ingreso', 'cuenta-a');
    await expect(servicio.agregarCuenta('Nueva', 'Cuenta', -1))
      .rejects.toThrow('El saldo inicial no puede ser negativo.');
    expect(inserciones).toHaveLength(1);
  });
});
