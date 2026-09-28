# Estructura de datos de FinSight

```mermaid
erDiagram
    auth_users ||--o{ cuentas : tiene
    auth_users ||--o{ movimientos : registra
    auth_users ||--o{ presupuestos : define
    auth_users ||--o{ metas : crea
    cuentas ||--o{ movimientos : contiene

    auth_users {
        uuid id PK
        text email
    }
    cuentas {
        uuid id PK
        uuid usuario_id FK
        text nombre
        text tipo
        numeric saldo_inicial
        text color
        timestamptz created_at
    }
    movimientos {
        uuid id PK
        uuid usuario_id FK
        uuid cuenta_id FK
        text nombre
        text categoria
        numeric monto
        text tipo "ingreso o gasto"
        timestamptz fecha
    }
    presupuestos {
        uuid usuario_id PK,FK
        text categoria PK
        numeric limite
    }
    metas {
        uuid id PK
        uuid usuario_id FK
        text nombre
        numeric objetivo
        numeric actual
        date vence
        text color
        text emoji
        timestamptz created_at
    }
```

- `auth.users` la crea Supabase Auth. El correo y la contraseña no se guardan en las tablas de la app.
- Una cuenta tiene muchos movimientos. El saldo mostrado es `saldo_inicial + ingresos - gastos` de esa cuenta.
- El presupuesto guarda el límite de cada categoría. Lo gastado se calcula con los movimientos del mes actual, así que los límites se reutilizan cada mes.
- Las categorías y sus iconos son opciones de la interfaz, no otra tabla.
- Cada tabla tiene `usuario_id`. Las políticas RLS permiten leer y cambiar solo las filas del usuario autenticado. La clave foránea compuesta de `movimientos` exige que la cuenta pertenezca al mismo usuario.

El SQL que crea esta estructura está en [schema.sql](schema.sql).
