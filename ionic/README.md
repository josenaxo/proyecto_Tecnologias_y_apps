# FinSight — Ionic + Angular

Interfaz móvil basada en el diseño original de `../project`. No usa Supabase, Vercel ni servicios externos.

## Ejecutar

```bash
cd ionic
npm install
npm start
```

Abre la dirección local indicada por Angular. Para comprobar la compilación: `npm run build`.

## Estructura para presentar

Hay seis páginas: `bienvenida`, `inicio`, `cuentas`, `nuevo`, `metas` y `perfil`. Cada carpeta tiene un `.page.ts` para el estado y las acciones, un `.page.html` para la vista y un `.page.scss` para sus estilos.

- `src/app/app.routes.ts` asigna una URL a cada página. `/` lleva a Bienvenida y el antiguo `/home` redirige a Inicio.
- `src/app/navegacion` contiene la barra inferior. Sus enlaces usan `routerLink`; `routerLinkActive` marca la página actual.
- `src/app/finanzas.service.ts` conserva los datos de ejemplo para que se compartan entre páginas. No hay base de datos.
- `src/global.scss` contiene los colores y estilos que se repiten.

Para mantener seis páginas, la lista completa y el análisis se despliegan dentro de Inicio. El presupuesto usa la misma ruta de Cuentas con `?presupuesto=1`; su botón «volver» regresa a la vista de cuentas. El formulario Nuevo guarda un movimiento en memoria y vuelve a Inicio. `[(ngModel)]` conecta los campos con las variables; `@for` dibuja listas y `@if` muestra las secciones opcionales.

Los datos se reinician al recargar. Las funciones que requieren servicios futuros muestran un aviso.
