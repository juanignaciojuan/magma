# Magma

Catálogo web interactivo de Magma. El sitio es una página estática: no necesita un servidor backend ni una instalación de dependencias para funcionar.

## Cómo funciona

- `index.html` contiene la estructura de las pantallas: menú, mapas, cronograma, salas, galería y ventanas de información/video.
- `script.js` controla la navegación, el historial de vistas, los botones, los mapas interactivos, la galería, el reproductor de video, los sonidos y el fondo animado.
- `data.js` contiene el listado de proyectos que aparece en la galería.
- `schedule.js` contiene los días, espacios, horarios y títulos del cronograma.
- `style.css` define la apariencia, la distribución responsive y las animaciones.
- `img/` contiene mapas, miniaturas, íconos y otros recursos visuales.
- `video/` contiene los videos de los proyectos.
- `audio/` contiene los sonidos y la música ambiental.
- `fonts/` contiene las fuentes usadas por el sitio.
- `CNAME` configura el dominio publicado: `magma.chela.org.ar`.

Al abrir el sitio, la persona entra mediante la pantalla inicial y puede elegir el mapa o el cronograma. Desde un mapa puede seleccionar una sala y ver sus proyectos. Cada proyecto muestra una miniatura; al seleccionarla, se abre su video junto con el título, artista, descripción y etiquetas.

## Cómo editar un proyecto

1. Copiá la miniatura en `img/` y el video en `video/`.
2. Abrí `data.js` y agregá un objeto dentro del arreglo `projects`:

```js
{
  img: "img/mi-miniatura.jpg",
  video: "video/mi-video.mp4",
  volume: 0.2,
  title: "Título del proyecto",
  artist: "Nombre de la persona o del colectivo",
  desc: "Descripción breve del proyecto",
  roomTag: "colectivo",
  tags: ["instalación", "video"]
}
```

`volume` es opcional y acepta un valor entre `0.0` y `1.0`. `roomTag` debe coincidir con una sala que ya utilice el sitio. Conservá las comas, las comillas y las rutas relativas. Los nombres de archivos deben coincidir exactamente, incluyendo mayúsculas y minúsculas.

## Cómo editar el cronograma

Editá `SOURCE_SCHEDULE` en `schedule.js`. Cada espacio contiene bloques con un nombre, una hora y un arreglo de títulos. Los títulos deben coincidir con los proyectos de `data.js` si se espera vincularlos conceptualmente.

```js
{
  space: "NÓMADE",
  blocks: [
    {
      block: "BLOQUE 1",
      time: "20:00",
      titles: ["Título del proyecto"]
    }
  ]
}
```

Usá el formato de hora de 24 horas (`HH:MM`). El sitio ordena los eventos automáticamente por hora.

## Flujo correcto de trabajo con Git

### Crear una nueva web y conservar la versión anterior

Cuando comience un nuevo año, primero guardá la versión publicada actualmente en una rama de respaldo. En este caso, `main` todavía contiene la web de 2025:

```bash
git switch main
git pull origin main
git switch -c backup2025
git push -u origin backup2025
```

La rama `backup2025` debe conservarse sin cambios. Funcionará como archivo de la web anterior y permitirá recuperarla o consultarla aunque después `main` pase a contener la nueva versión.

Después de crear el respaldo, volvé a `main` y creá una rama independiente para la web de este año:

```bash
git switch main
git pull origin main
git switch -c web-2026
```

Trabajá únicamente en `web-2026` mientras desarrollás la nueva página. Podés reemplazar o reorganizar completamente `index.html`, `style.css`, `script.js`, `data.js`, `schedule.js` y los recursos de `img/`, `video/`, `audio/` y `fonts/` según las necesidades del nuevo año. La rama `backup2025` no debe usarse como rama de trabajo ni modificarse.

Subí la rama nueva para que quede disponible para revisión:

```bash
git add -A -- index.html style.css script.js data.js schedule.js img video audio fonts CNAME
git commit -m "Crea la web 2026"
git push -u origin web-2026
```

El uso del mismo repositorio y del mismo dominio de GitHub Pages no requiere crear otro repositorio. GitHub Pages publicará la versión que termine en `main`, por lo que la web nueva no reemplazará públicamente a la anterior hasta que sea aprobada e integrada.

Cuando la nueva web esté lista, no la fusiones ni la muevas a `main` por tu cuenta. Avisale al administrador con el nombre de la rama, por ejemplo `web-2026`, y esperá su revisión y autorización. El administrador decidirá cuándo integrar esa rama en `main`; la rama `backup2025` quedará disponible como respaldo histórico.

Cada cambio debe hacerse en una rama propia. No trabajes directamente sobre `main`.

### Primera vez: clonar el repositorio y crear una rama

```bash
git clone https://github.com/juanignaciojuan/magma.git
cd magma
git switch main
git pull origin main
git switch -c nombre-descriptivo-del-cambio
```

Usá nombres claros, por ejemplo `actualizar-cronograma` o `agregar-proyectos-2025`.

### Trabajos posteriores

Desde la carpeta del repositorio:

```bash
git switch main
git pull origin main
git switch nombre-descriptivo-del-cambio
```

Si la rama ya existe en remoto, también podés actualizarla así:

```bash
git pull origin nombre-descriptivo-del-cambio
```

### Guardar y subir cambios

Antes de confirmar, revisá qué archivos cambiaste:

```bash
git status
git diff
```

Después, agregá solo los archivos relacionados, creá un commit y subí la rama:

```bash
git add data.js schedule.js img/ video/
git commit -m "Actualiza proyectos y cronograma"
git push -u origin nombre-descriptivo-del-cambio
```

No agregues carpetas o archivos que no formen parte del cambio. Si editaste otros archivos, reemplazá la lista de `git add` por los archivos correspondientes.

## Validación antes de pedir integración

1. Abrí `index.html` en el navegador o levantá un servidor local desde la raíz del proyecto:

   ```bash
   python -m http.server 8000
   ```

   Luego visitá `http://localhost:8000`.
2. Comprobá la pantalla inicial, el menú, los tres mapas, las salas, la galería, el cronograma y el reproductor de video.
3. Revisá que no haya errores en la consola del navegador y que las miniaturas, videos, fuentes y sonidos carguen correctamente.
4. Verificá la vista en escritorio y en teléfono.
5. Confirmá que `git status` no muestre archivos accidentales y que el commit solo incluya lo esperado.

## Aviso al administrador

Después de subir la rama, avisale al administrador antes de intentar mover, fusionar o hacer merge hacia `main`. Incluí:

- el nombre de la rama;
- un resumen de los cambios;
- los archivos nuevos o reemplazados;
- las pruebas realizadas;
- cualquier problema pendiente, especialmente el tamaño o la carga de videos.

El administrador revisará la rama y dará autorización para integrarla a `main`. No hagas `git push origin main` ni abras un merge sin ese aviso y aprobación previa.