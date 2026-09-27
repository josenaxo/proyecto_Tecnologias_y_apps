# FinSight en Ionic + Angular

Versión sencilla del mockup de `../html`. Incluye bienvenida, inicio, movimientos, cuentas, nuevo movimiento, metas, análisis, presupuesto y perfil. Usa componentes de Ionic como `ion-list`, `ion-item`, `ion-input`, `ion-select`, `ion-grid` y `ion-progress-bar`.

## Ejecutar

1. Instalar Node.js compatible con Angular 22 (22.22.3+, 24.15+ o 26).
2. Abrir esta carpeta y ejecutar `npm install`.
3. Ejecutar `npm start`.
4. Abrir la dirección local que muestra la terminal. Para compilar: `npm run build`.

La plantilla incluye Capacitor, pero todavía no se han agregado los proyectos nativos de Android o iOS. La app se puede presentar en el navegador, con la vista móvil activada.

## Dónde está cada cosa

- `src/app/home/home.page.html`: todas las pantallas. `@switch` elige cuál se ve; `@for` dibuja listas; `@if` muestra formularios o mensajes según el estado.
- `src/app/home/home.page.ts`: datos de ejemplo, variables de la pantalla y acciones de botones. `pagina` indica la pantalla actual. `ir()` la cambia.
- `src/app/home/home.page.scss`: apariencia inspirada en el mockup.
- `src/app/app.routes.ts`: ruta inicial `/home`; `app.component.html` contiene el `ion-router-outlet`.
- `src/main.ts`: arranca Angular e Ionic. No hay que modificarlo para cambiar los datos o el diseño.

## Entender el flujo

1. En movimientos, el arreglo `movimientos` se muestra con `@for`. El texto de búsqueda y el filtro cambian qué elementos devuelve `movimientosFiltrados`.
2. En nuevo, `[(ngModel)]` enlaza cada campo con una variable de TypeScript. `guardarMovimiento()` comprueba los campos, agrega un objeto al arreglo y ajusta el saldo de la cuenta elegida.
3. `ingresos`, `gastos` y `balance` suman los arreglos. Por eso el inicio y el análisis cambian al agregar un movimiento.
4. Las metas usan otro arreglo. `guardarMeta()` agrega una meta y `abonarMeta()` cambia su avance.
5. El presupuesto compara el gasto por categoría con cada límite. Los límites se pueden editar en la pantalla.
6. El perfil permite cambiar la apariencia y descargar los movimientos como CSV.

**Para la interrogación:** qué hace un componente standalone; para qué sirven `@if`, `@for` y `@switch`; cómo `[(ngModel)]` conecta formulario y variable; cómo un `(click)` llama un método; cómo se recorre un arreglo con `filter` y `reduce`; por qué `ion-list` contiene `ion-item`. Pueden probar cada concepto cambiando un dato de ejemplo y observando la pantalla.

## Alcance actual

Todos los datos son **de demostración y viven en memoria**: al recargar, vuelven a su estado inicial. Las cuentas no están conectadas a bancos. No hay registro, login, API, Supabase ni base de datos todavía. La descarga CSV es local. Esta etapa permite explicar la interfaz y los estados sin introducir servicios de backend.

Referencia del ramo: https://udd-web-mobile.vercel.app/aprende
