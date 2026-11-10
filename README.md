# Encriptador de texto

Mini aplicación web para encriptar y desencriptar mensajes con reglas de sustitución. Funciona por completo en el navegador, sin servidores ni registros.

**Demo:** <https://encriptador-de-texto-jose-mondragons-projects.vercel.app/>

**Estado:** proyecto completado y publicado como demo.

## Funcionalidades

- Encriptación y desencriptación en el navegador.
- Validación de mayúsculas, acentos y caracteres no permitidos.
- Botón para normalizar el texto a minúsculas y sin acentos.
- Contador de caracteres, limpieza y copia del resultado.
- Atajos: `Ctrl/Cmd + Enter` para encriptar y `Ctrl/Cmd + Shift + Enter` para desencriptar.
- Interfaz responsive y accesible.

## Reglas de sustitución

| Letra | Secuencia |
| --- | --- |
| e | enter |
| i | imes |
| a | ai |
| o | ober |
| u | ufat |

## Tecnologías

- HTML5
- CSS3
- JavaScript
- Vercel

## Ejecutar en local

Abre `index.html` en el navegador o sirve la carpeta con cualquier servidor estático.

```bash
npx serve .
```

## Estructura

```text
.
├── index.html
├── styles.css
├── index.js
└── favicon.svg
```

## Nota

Las reglas son una transformación reversible con fines demostrativos. No sustituyen un sistema de cifrado seguro.
