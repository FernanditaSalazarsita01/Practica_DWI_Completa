# Práctica de laboratorio DWI

Aplicación web responsiva desarrollada con HTML, CSS y JavaScript puro.

## Contenido

1. **Calculadora de edad**
   - Selector personalizado mediante listas de día, mes y año.
   - No utiliza `input type="date"`.
   - Valida fechas inexistentes, incompletas y futuras.
   - Muestra el resultado en años y meses.

2. **Convertidor de temperatura**
   - Convierte entre Celsius, Fahrenheit y Kelvin.
   - El botón permanece deshabilitado hasta completar los tres campos.
   - Valida resultados inferiores al cero absoluto.

3. **Gestor de tareas**
   - Usa un arreglo de objetos con la estructura:
     ```js
     [{ descripcion: "", completada: false }]
     ```
   - Renderiza la lista mediante `renderTasks()`.
   - Las tareas pendientes aparecen primero.
   - Las completadas se tachan y se mueven al final.
   - Permite desmarcar y eliminar tareas.
   - Conserva los datos en `localStorage`.

## Estructura

```text
practica_dwi/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── .gitignore
└── README.md
```

## Uso local

Abre `index.html` directamente en el navegador.

También puedes usar la extensión **Live Server** de Visual Studio Code.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos del proyecto.
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Guarda los cambios.
6. GitHub mostrará la URL pública después de algunos minutos.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
