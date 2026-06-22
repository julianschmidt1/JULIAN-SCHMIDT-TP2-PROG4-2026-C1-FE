# Red Social - Frontend

Frontend de la aplicación Red Social desarrollada con Angular para la materia Programación 4.

## Stack

* Angular 21
* TypeScript
* SCSS
* PrimeNG
* PrimeIcons
* Vercel

## Sprint 1

En este sprint se implementó la base visual y funcional del frontend.

### Funcionalidades incluidas

* Creación del proyecto Angular.
* Configuración de rutas con lazy loading.
* Layout para pantallas públicas.
* Layout para pantallas privadas.
* Pantalla de login.
* Pantalla de registro.
* Pantalla de publicaciones.
* Pantalla de mi perfil.
* Navegación entre pantallas.
* Validaciones de formularios.
* Login conectado al backend.
* Registro conectado al backend.
* Persistencia del usuario autenticado en localStorage.
* AuthGuard para proteger rutas privadas.
* GuestGuard para evitar acceder a login/registro estando autenticado.
* Cierre de sesión.
* Toasts para mensajes de error y feedback.
* Favicon personalizado.
* Título de página personalizado.
* Diseño dark mode con estética vaporwave sutil.

---

## Sprint 2

En este sprint se incorporó la funcionalidad principal de la red social, permitiendo la interacción con publicaciones y la visualización del perfil del usuario.

### Funcionalidades incluidas

#### Publicaciones

* Listado de publicaciones obtenido desde el backend.
* Ordenamiento por fecha (por defecto).
* Ordenamiento por cantidad de me gusta.
* Paginación mediante carga incremental.
* Cada publicación implementada como componente independiente.
* Creación de publicaciones mediante formulario modal.
* Soporte para carga de imágenes.
* Dar y quitar me gusta a publicaciones.
* Eliminación de publicaciones propias.
* Confirmación antes de eliminar una publicación.
* Actualización dinámica del feed sin recargar la página.

#### Perfil

* Visualización de todos los datos del usuario autenticado.
* Visualización de la foto de perfil.
* Listado de las últimas tres publicaciones del usuario.

#### Mejoras generales

* Refactorización de componentes para mejorar la reutilización.
* Uso de Signals para el manejo del estado de la interfaz.
* Integración completa con los nuevos endpoints del backend.
* Mejoras de estilos y consistencia visual entre pantallas.

## Rutas principales

* `/login`
* `/register`
* `/posts`
* `/profile`

## Ejecución local

```bash
npm install
npm run start
```

La aplicación corre por defecto en:

```text
http://localhost:4200
```

## Backend

El frontend consume la API del backend NestJS mediante la URL configurada en:

```text
src/environments/environment.ts
```