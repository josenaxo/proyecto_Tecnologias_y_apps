# FinSight — Ionic, Angular y Supabase

Seis pantallas: Bienvenida (registro e inicio de sesión), Inicio, Cuentas, Nuevo, Metas y Perfil. La estructura sigue la [clase 3](https://udd-web-mobile.vercel.app/aprende/clase-3): un cliente de Supabase, `select` para leer, `insert` para crear, `update` para modificar y Auth para identificar al usuario.

## Proyecto Supabase

La URL y la clave pública del proyecto ya están configuradas en `src/environments/environment.ts` y `src/environments/environment.prod.ts`. Nunca uses la `service_role` key en Ionic. La API confirma que existen las cuatro tablas y que el rol sin sesión no puede leerlas. Para reproducir la estructura en otro proyecto, ejecuta [supabase/schema.sql](supabase/schema.sql) una vez en **SQL Editor**.

Para ejecutar la app desde la raíz del repositorio, usa la versión de Node indicada en [`.node-version`](.node-version):

```bash
cd ionic
npm ci
npm start
```

Consulta el [README raíz](../README.md) para las verificaciones y las referencias a los prototipos anteriores.

Este proyecto tiene confirmación de correo activada. Tras registrarte, abre el enlace recibido antes de iniciar sesión. Revisa también **Authentication → URL Configuration** para que la confirmación vuelva a la URL de tu app (por ejemplo, `http://localhost:8100` si ejecutas Ionic en ese puerto).

## Flujo para presentar

1. En Bienvenida, crea una cuenta o inicia sesión. `supabase.service.ts` crea el cliente y maneja Auth; `auth.guard.ts` protege las otras cinco rutas.
2. En Cuentas, agrega una cuenta con saldo inicial. En Nuevo, elige esa cuenta y guarda ingresos o gastos. `finanzas.service.ts` lee y escribe en Supabase y calcula balance, totales, análisis y gasto mensual desde los movimientos.
3. En Cuentas → Presupuesto, cambia un límite y pulsa Guardar. En Metas, crea una meta y suma ahorro. Al recargar, los datos siguen allí.
4. En Perfil, cierra sesión. Las políticas RLS hacen que cada usuario vea solo sus datos.

Consulta el [diagrama de la base de datos](supabase/DIAGRAMA.md). No se usa Storage porque la app financiera no maneja fotos. La interfaz deja de mostrar cifras de ejemplo para que los importes siempre correspondan a lo guardado.
