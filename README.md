# FinSight

Aplicación de finanzas personales con Ionic, Angular y Supabase. La única aplicación activa está en [`ionic/`](ionic/): Bienvenida, Inicio, Cuentas, Nuevo, Metas y Perfil.

## Ejecutar localmente

Usa la versión de Node indicada en [`ionic/.node-version`](ionic/.node-version). Desde la raíz del repositorio:

```powershell
cd ionic
npm ci
npm start
```

Abre la dirección que indique el servidor en la terminal. La configuración de Supabase y el recorrido de presentación están en el [README de la aplicación](ionic/README.md).

## Verificaciones

Desde `ionic/`:

```powershell
npm run build
npm test -- --watch=false
npm run lint
```

## Estructura

- `ionic/src/`: código y recursos de la aplicación.
- `ionic/supabase/`: SQL y diagrama de la base de datos. Consulta las instrucciones de la aplicación antes de ejecutar el SQL.
- `.gitignore`: exclusiones para dependencias, compilación, cachés y archivos locales.

## Prototipos anteriores

Las carpetas `html/` (pantallas HTML estáticas) y `project/` (prototipo React y Vite) se retiraron del árbol de trabajo para mantener una sola aplicación activa. Se conservan como referencia en el historial de Git, en el commit `7dfd9e4`:

- [Prototipo HTML](https://github.com/josenaxo/proyecto_Tecnologias_y_apps/tree/7dfd9e4/html).
- [Prototipo React](https://github.com/josenaxo/proyecto_Tecnologias_y_apps/tree/7dfd9e4/project).

Para consultarlos localmente sin modificar la aplicación actual, desde la raíz:

```powershell
git ls-tree -r --name-only 7dfd9e4 -- html project
git show 7dfd9e4:html/README.md
git show 7dfd9e4:project/src/App.tsx
```

También puedes exportarlos a un ZIP para examinarlos por separado:

```powershell
git archive --format=zip --output=../finsight-prototipos.zip 7dfd9e4 html project
```
