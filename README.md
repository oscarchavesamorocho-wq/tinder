[# 💘 Tinder UI - Aplicación Web.txt](https://github.com/user-attachments/files/33977926/Tinder.UI.-.Aplicacion.Web.txt)
# 💘 Tinder UI - Aplicación Web de Interacción por Deslizamiento

Aplicación web desarrollada con **HTML5, CSS3 y JavaScript vanilla**, inspirada en la experiencia de interacción de aplicaciones de citas basadas en tarjetas y deslizamientos.

El proyecto implementa una experiencia interactiva de tipo **Tinder**, permitiendo descubrir perfiles, realizar acciones de *like*, *dislike* y *super like*, simular coincidencias (*matches*), consultar perfiles, gestionar conversaciones de demostración y editar un perfil propio.

> **Importante:** este proyecto es un MVP educativo y demostrativo. No utiliza un servidor, API, sistema de autenticación ni base de datos real. La información se almacena localmente en el navegador mediante `localStorage`.

---

## 🌐 Demo / Repositorio

**Repositorio:**  
https://github.com/oscarchavesamorocho-wq/tinder

---

## 📋 Descripción del proyecto

El objetivo del proyecto es desarrollar una interfaz web que reproduzca los principales patrones de interacción de una aplicación moderna de descubrimiento de perfiles.

La aplicación está diseñada alrededor de una interfaz de tarjetas donde el usuario puede tomar decisiones sobre los perfiles disponibles mediante:

- Deslizamiento hacia la izquierda para rechazar.
- Deslizamiento hacia la derecha para indicar interés.
- Acción de **Super Like**.
- Botón para deshacer la última decisión.
- Consulta detallada de un perfil.
- Simulación de coincidencias.
- Acceso a conversaciones después de un match.
- Edición y almacenamiento del perfil propio.

La aplicación utiliza una arquitectura modular en JavaScript, separando responsabilidades relacionadas con perfiles, coincidencias, mensajes, interfaz y lógica principal.

---

# ✨ Características principales

## 👤 Descubrimiento de perfiles

La vista principal presenta perfiles mediante tarjetas interactivas.

Cada tarjeta puede mostrar:

- Nombre.
- Edad.
- Ubicación.
- Descripción.
- Intereses.
- Fotografía.

Los perfiles se cargan desde una colección local definida en JavaScript.

Actualmente el proyecto incluye perfiles de demostración, por ejemplo:

- Leila, 27 años, Bucaramanga.
- Álex, 25 años, Medellín.

La información está definida como datos locales y no procede de una API externa.

---

## 👆 Sistema de Swipe

Una de las funcionalidades principales es el sistema de interacción mediante arrastre.

El usuario puede tomar una tarjeta y desplazarla horizontalmente.

### Swipe hacia la derecha

Representa un:

**LIKE**

### Swipe hacia la izquierda

Representa un:

**DISLIKE / NOPE**

### Swipe hacia arriba

La aplicación dispone además de la acción:

**SUPER LIKE**

La lógica utiliza un umbral de **75 píxeles** para determinar si el movimiento realizado representa una decisión. Si el movimiento no alcanza ese valor, la tarjeta vuelve a su posición original.

También se aplican animaciones de rotación y desplazamiento durante la interacción para proporcionar una experiencia más cercana a una aplicación móvil.

---

# 🎯 Acciones disponibles

La interfaz principal cuenta con cinco acciones:

| Acción | Función |
|---|---|
| ↩️ Deshacer | Revierte la última decisión |
| ❌ Pasar | Rechaza el perfil |
| ⭐ Super Like | Realiza un Super Like |
| ❤️ Like | Indica interés |
| ⚡ Ver perfil | Muestra los detalles del perfil |

Estas acciones también pueden ejecutarse mediante los botones inferiores, además del sistema de deslizamiento.

---

# 💕 Sistema de Matches

El proyecto implementa un sistema de coincidencias simulado.

Cuando el usuario realiza un `like` o `superlike`, la aplicación comprueba si el perfil forma parte de los identificadores configurados para producir una coincidencia.

Actualmente existen perfiles configurados para simular:

- Match mediante Like.
- Match mediante Super Like.

Esto permite demostrar el flujo completo sin necesidad de contar con otro usuario conectado al sistema.

Cuando se produce una coincidencia, aparece una ventana modal informando al usuario.

La aplicación también aclara que se trata de un:

> Match simulado con datos locales.

Por lo tanto, no se afirma que exista interés real por parte de otra persona.

---

# 💬 Sistema de mensajes

Después de obtener un match, el usuario puede acceder a una conversación de demostración.

El sistema permite:

- Ver conversaciones disponibles.
- Abrir un chat.
- Escribir mensajes.
- Enviar mensajes.
- Visualizar la hora del mensaje.
- Ver una vista previa del último mensaje.
- Marcar una conversación como leída.
- Ordenar las conversaciones por actividad reciente.

Los mensajes se almacenan localmente en el navegador.

No existe comunicación entre usuarios reales ni envío de información hacia un servidor.

---

# 👤 Perfil propio

La aplicación incorpora una sección denominada:

**Mi perfil**

Desde allí el usuario puede modificar:

- Nombre.
- Edad.
- Ubicación.
- Descripción.
- Intereses.

Los datos se guardan utilizando `localStorage`.

La aplicación realiza validaciones antes de guardar la información.

### Validaciones implementadas

**Nombre**

- Mínimo: 2 caracteres.
- Máximo: 40 caracteres.

**Edad**

- Mínimo: 18 años.
- Máximo: 99 años.
- Debe ser un número entero.

**Ubicación**

- Mínimo: 2 caracteres.
- Máximo: 40 caracteres.

**Descripción**

- Máximo: 280 caracteres.

**Intereses**

- Máximo: 80 caracteres.

---

# 🧠 Persistencia de información

El proyecto utiliza la API:

```javascript
localStorage
```

para conservar información dentro del navegador.

Se utiliza un prefijo:

```javascript
tinder-mvp:
```

para organizar las claves utilizadas por la aplicación.

Entre los datos almacenados se encuentran:

```text
tinder-mvp:decisions
tinder-mvp:matches
tinder-mvp:undo
tinder-mvp:conversations
tinder-mvp:ownProfile
```

Esto permite mantener el estado de la aplicación después de recargar la página en el mismo navegador.

### ⚠️ Limitación

`localStorage` **no es una base de datos**.

Los datos:

- No se sincronizan entre dispositivos.
- No se comparten entre usuarios.
- No cuentan con autenticación.
- No están protegidos como información sensible.
- Pueden ser eliminados por el usuario o por el navegador.

Por esta razón, la aplicación debe considerarse una **demostración frontend/MVP** y no un sistema de producción.

---

# 🏗️ Arquitectura del proyecto

El proyecto utiliza una arquitectura frontend modular basada en JavaScript vanilla.

La estructura principal es:

```text
tinder/
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── imagenes/
│   ├── 1.webp
│   └── 2.webp
│
├── js/
│   ├── app.js
│   ├── matches.js
│   ├── messages.js
│   ├── profiles.js
│   └── ui.js
│
├── index.html
├── iphone.webp
├── tinder-icons.webp
└── tinder-logo.webp
```

La estructura actual del repositorio está organizada precisamente alrededor de estas carpetas y archivos.

---

# 🧩 Organización del JavaScript

## `profiles.js`

Responsable de la información relacionada con los perfiles.

Incluye:

- Datos de perfiles.
- Búsqueda de perfiles por ID.
- Obtención de perfiles disponibles.
- Perfil actual.
- Formateo de intereses.
- Lectura y escritura de datos mediante `localStorage`.

Los perfiles se representan mediante objetos JavaScript.

---

## `matches.js`

Gestiona la lógica de:

- Likes.
- Dislikes.
- Super Likes.
- Matches.
- Historial de decisiones.
- Deshacer acciones.
- Persistencia de matches.

También contiene la configuración que determina qué perfiles producen coincidencias simuladas.

---

## `messages.js`

Controla las conversaciones.

Sus responsabilidades incluyen:

- Crear conversaciones.
- Obtener conversaciones.
- Ordenarlas por actividad.
- Agregar mensajes.
- Marcar conversaciones como leídas.
- Obtener la vista previa del último mensaje.
- Formatear las horas.


---

## `ui.js`

Contiene gran parte de la lógica de presentación e interacción de la interfaz.

Gestiona:

- Cambio entre vistas.
- Renderizado de tarjetas.
- Renderizado de matches.
- Renderizado de mensajes.
- Renderizado del chat.
- Modales.
- Perfil propio.
- Validación del formulario.
- Actualización de elementos del DOM.

Las vistas principales son:

```text
Descubrir
Matches
Mensajes
Mi perfil
```


---

## `app.js`

Actúa como controlador de las interacciones principales.

Gestiona:

- Swipe.
- Eventos de mouse.
- Eventos táctiles.
- Botones de acción.
- Navegación.
- Envío de mensajes.
- Formulario de perfil.
- Modales.
- Animaciones.
- Deshacer decisiones.

El sistema soporta tanto interacción mediante mouse como mediante dispositivos táctiles.

---

# 🎨 Diseño de interfaz

El diseño está construido completamente con CSS personalizado.

La interfaz utiliza una estética inspirada en aplicaciones móviles modernas, utilizando:

- Tarjetas redondeadas.
- Sombras.
- Animaciones.
- Gradientes.
- Botones circulares.
- Navegación inferior.
- Modales.
- Estados visuales para Like, Nope y Super Like.

La hoja principal utiliza variables CSS para centralizar colores, radios, sombras, tipografía y transiciones.

### Paleta principal

```css
--color-like: #29dba0;
--color-nope: #ff5364;
--color-super: #5c9dff;
--color-accent: #fe426f;
```

Esto permite mantener una identidad visual coherente en los diferentes componentes.

---

# 📱 Diseño responsive

El proyecto incorpora reglas específicas para diferentes tamaños de pantalla.

En dispositivos pequeños, la aplicación pasa de una presentación tipo dispositivo móvil centrado a utilizar prácticamente todo el viewport.

```text
≤ 720px
```

se adapta para ocupar:

```text
100% del ancho
100dvh de altura
```

Además, los controles táctiles cuentan con un tamaño mínimo de aproximadamente **44 px**, facilitando su utilización en dispositivos móviles.

---

# ♿ Accesibilidad

Aunque el proyecto es principalmente visual, se incorporaron algunas prácticas de accesibilidad:

- `aria-label` en elementos interactivos.
- `aria-current` para identificar la vista activa.
- Etiquetas para formularios.
- Texto alternativo en imágenes.
- Elementos visualmente ocultos mediante `.sr-only`.
- Estados de foco mediante `:focus-visible`.
- Uso de elementos semánticos como `main`, `section`, `nav`, `form` y `dialog`.

Por ejemplo, la navegación inferior utiliza `aria-current="page"` para identificar la sección activa.

---

# 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño, responsive y animaciones |
| JavaScript ES6+ | Lógica e interacción |
| DOM API | Manipulación dinámica de la interfaz |
| LocalStorage API | Persistencia local |
| HTML Dialog | Ventanas modales |
| WebP | Recursos gráficos |

No se utilizan frameworks frontend como:

- React
- Angular
- Vue
- Svelte

Tampoco se utiliza actualmente un backend.

---

# 🚀 Instalación y ejecución

Este proyecto no requiere Node.js, npm ni un servidor backend para ejecutarse en su versión actual.

### 1. Clonar el repositorio

```bash
git clone https://github.com/oscarchavesamorocho-wq/tinder.git
```

### 2. Entrar al proyecto

```bash
cd tinder
```

### 3. Ejecutar

La opción más sencilla es abrir:

```text
index.html
```

directamente en un navegador.

También puede utilizarse una extensión como **Live Server** desde Visual Studio Code para ejecutar el proyecto mediante un servidor local.

---

# 🧪 Flujo de uso

El funcionamiento principal puede resumirse así:

```text
        ┌─────────────────┐
        │   Abrir app     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │    Descubrir    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Ver perfil      │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
     Dislike            Like
        │                 │
        │                 ▼
        │          ¿Match simulado?
        │                 │
        │            ┌────┴────┐
        │            │         │
        │            ▼         ▼
        │           No        Sí
        │                      │
        │                      ▼
        │                 Match creado
        │                      │
        │                      ▼
        │                    Chat
        │
        └──────────────► Siguiente perfil
```

---

# 🔐 Seguridad y privacidad

Este proyecto **no debe considerarse una aplicación de producción**.

Actualmente no cuenta con:

- Sistema de autenticación.
- Registro de usuarios.
- Backend.
- Base de datos.
- Encriptación de información.
- Control de acceso.
- API.
- Comunicación entre usuarios reales.
- Gestión de sesiones en servidor.

Toda la información utilizada por la aplicación permanece en el navegador del usuario mediante `localStorage`.

Por lo tanto, no se deben almacenar contraseñas, documentos, información financiera u otros datos sensibles.

---

# 📊 Estado actual del proyecto

### Implementado

- [x] Interfaz de descubrimiento.
- [x] Tarjetas de perfiles.
- [x] Swipe con mouse.
- [x] Swipe táctil.
- [x] Like.
- [x] Dislike.
- [x] Super Like.
- [x] Deshacer.
- [x] Vista detallada de perfiles.
- [x] Matches simulados.
- [x] Lista de matches.
- [x] Conversaciones locales.
- [x] Envío de mensajes de demostración.
- [x] Perfil propio.
- [x] Validación del perfil.
- [x] Persistencia mediante `localStorage`.
- [x] Diseño responsive.
- [x] Modales.
- [x] Navegación inferior.
- [x] Estados vacíos.
- [x] Elementos básicos de accesibilidad.

---

# 🚧 Limitaciones actuales

El proyecto está diseñado como un MVP frontend, por lo que existen algunas limitaciones intencionales:

1. Los perfiles son estáticos.
2. Los matches son simulados.
3. Los mensajes son locales.
4. No existe comunicación entre usuarios.
5. No existe autenticación.
6. No existe una base de datos.
7. No existe backend.
8. No existe una API.
9. Los datos dependen del navegador utilizado.
10. No existe sincronización entre dispositivos.

Estas limitaciones permiten mantener el proyecto sencillo y concentrarse en la implementación de la interfaz, interacción y lógica frontend.

---

# 🔮 Próximas mejoras

Una futura versión podría evolucionar hacia una arquitectura full-stack.

### Backend

Se podría implementar:

```text
Frontend
   │
   ▼
REST API
   │
   ▼
Backend
   │
   ▼
Base de datos
```

### Funcionalidades futuras

- [ ] Registro de usuarios.
- [ ] Inicio de sesión.
- [ ] Autenticación segura.
- [ ] Base de datos.
- [ ] Perfiles dinámicos.
- [ ] Subida de fotografías.
- [ ] Sistema de matches reales.
- [ ] Chat en tiempo real.
- [ ] Notificaciones.
- [ ] Sistema de preferencias.
- [ ] Filtrado por ubicación.
- [ ] Sistema de recomendaciones.
- [ ] Gestión de usuarios.
- [ ] Panel administrativo.
- [ ] API REST.
- [ ] Protección de datos.
- [ ] Despliegue en producción.

---

# 🧱 Posible arquitectura futura

Para convertir este MVP en una aplicación completa, podría utilizarse una arquitectura como:

```text
┌───────────────────────────┐
│       Frontend Web        │
│ HTML / CSS / JavaScript   │
└─────────────┬─────────────┘
              │
              │ HTTP / REST
              ▼
┌───────────────────────────┐
│          API              │
│       Backend             │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        Base de datos      │
│ Usuarios / Perfiles       │
│ Likes / Matches / Chats   │
└───────────────────────────┘
```

Para el chat en tiempo real podría incorporarse posteriormente WebSocket o una tecnología como Socket.IO.

---

# 📚 Objetivo académico

Este proyecto puede utilizarse como ejercicio práctico para reforzar conocimientos relacionados con:

- Desarrollo frontend.
- HTML semántico.
- CSS moderno.
- JavaScript.
- Manipulación del DOM.
- Eventos.
- Programación modular.
- Persistencia local.
- Diseño responsive.
- Experiencia de usuario.
- Accesibilidad web.
- Gestión del estado de una aplicación.
- Arquitectura de software frontend.

---

# 👨‍💻 Autor

**Oscar Chaves Amorocho**

GitHub:

https://github.com/oscarchavesamorocho-wq

Repositorio:

https://github.com/oscarchavesamorocho-wq/tinder

---

# ⚠️ Aviso

Este proyecto ha sido desarrollado con fines **educativos y de demostración**.

No pretende replicar la infraestructura interna, sistemas propietarios, algoritmos privados ni servicios backend de Tinder.

La aplicación utiliza únicamente una experiencia visual y funcional inspirada en el concepto general de interacción mediante tarjetas.

**Tinder** es una marca registrada de su respectivo propietario.

---

# 📄 Licencia

Actualmente el repositorio no incluye una licencia de software explícita.

Si el proyecto se va a distribuir públicamente, se recomienda definir una licencia apropiada, como MIT, dependiendo del objetivo y de la procedencia de los recursos utilizados.
