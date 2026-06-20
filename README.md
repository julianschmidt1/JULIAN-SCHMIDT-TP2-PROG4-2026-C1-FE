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
