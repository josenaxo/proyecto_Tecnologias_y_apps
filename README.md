# FinSight — Plantillas HTML

Versión **HTML estática** del MVP que vive en `../src/App.tsx` (React + Vite + Tailwind).
Generada para poder abrir, compartir o entregar cada pantalla sin necesidad de compilar el proyecto React.

## Contenido

| Archivo | Pantalla | Origen en App.tsx |
|---|---|---|
| `index.html` | Galería / índice de pantallas | — |
| `onboarding.html` | Bienvenida (3 slides) | `Onboarding` |
| `home.html` | Inicio / Dashboard | `Home` |
| `transactions.html` | Movimientos (búsqueda + filtros) | `Transactions` |
| `accounts.html` | Cuentas (donut de patrimonio) | `Accounts` |
| `add.html` | Nuevo movimiento (teclado numérico) | `AddTransaction` |
| `goals.html` | Metas de ahorro | `Goals` |
| `analytics.html` | Análisis (barras + categorías) | `Analytics` |
| `budget.html` | Presupuesto mensual | `Budget` |
| `profile.html` | Perfil y ajustes | `Profile` |
| `assets/styles.css` | Marco de teléfono + reset (de `src/index.css` + `App.tsx`) | — |

## Cómo verlo

Abre `index.html` directamente en el navegador (doble clic), o levanta un servidor estático:

```bash
cd "Finsight app templates/html"
python3 -m http.server 4000
# http://localhost:4000
```

## Notas

- **Tailwind** se carga desde el CDN (`cdn.tailwindcss.com`) y las **fuentes** desde Google Fonts, así que la primera carga necesita internet.
- Los datos (transacciones, cuentas, metas, categorías) están "horneados" en el HTML: se copiaron de `App.tsx` en el momento de generar.
- La interactividad con estado de React (`useState`) se reescribió en JS vanilla dentro de cada archivo: toggle de saldo, slider de onboarding, filtros/buscador, teclado numérico, selector de periodo.
- Para regenerar tras cambiar `App.tsx`: `node _build.mjs` (revisa antes que los datos y textos coincidan).
