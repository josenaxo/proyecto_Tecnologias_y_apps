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

- `src/app/home/home.page.html`: las nueve vistas. `@switch` muestra una, `@for` recorre los datos y `@if` muestra elementos opcionales.
- `src/app/home/home.page.ts`: datos de ejemplo y acciones de la interfaz. `pagina` guarda la vista actual; `ir()` la cambia. `[(ngModel)]` conecta los campos con variables.
- `src/app/home/home.page.scss`: colores, tarjetas, gráficos simples y adaptación al tamaño del teléfono.
- `src/app/app.routes.ts`: ruta inicial. `app.component.html` contiene el espacio donde Ionic muestra la página.

Las tarjetas de resumen representan un mes completo; la lista contiene solo movimientos recientes de ejemplo. Se puede agregar un movimiento, crear una meta, editar límites y usar filtros. Estos cambios viven en memoria y se reinician al recargar. Los botones que requieren servicios futuros muestran un aviso.

Referencia del ramo: https://udd-web-mobile.vercel.app/aprende
