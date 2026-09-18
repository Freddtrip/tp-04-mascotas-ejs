# Trabajo práctico 04

## Descripción

## Instalación
pra instalar depenc¿dencia del proyecto usamos npm install
## Ejecución
Aplicación web para consultar mascotas en adopción y agregar temporalmente nuevos registros mediante un formulario.



## Páginas y rutas


GET /: muestra la página de inicio.
GET /mascotas`: muestra el catálogo de mascotas.
GET /mascotas/nueva: muestra el formulario para agregar una mascota.
GET /mascotas/:id: muestra el detalle de una mascota según su identificador.
POST /mascotas: recibe los datos del formulario y agrega una nueva mascota temporalmente en memoria.

## Estructura de vistas
La carpeta views contiene todos los archivos EJS del proyecto.

Dentro de views, los archivos se organizan de esta manera:

main.ejs es el layout principal. Contiene la estructura general que comparten las páginas.
inicio.ejs, no-encontrado.ejs, lista.ejs, detalle.ejs y nueva.ejs son las vistas. Cada una muestra el contenido específico de una página.
encabezado.ejs y pie.ejs son parciales. Son partes reutilizables que aparecen en distintas páginas.

## Recursos estáticos
css/estilos.css: contiene los estilos de las páginas.
img/mascota.svg: imagen utilizada para las mascotas.
js/app.js: archivo JavaScript que muestra un mensaje en la consola de que los registros estaticos fueron cargados.

## Formulario

El formulario permite ingresar una nueva mascota con nombre, especie, edad, estado y descripción.

Los datos se envían mediante POST a /mascotas.

Express utiliza express.urlencoded para interpretar los datos enviados por el formulario y dejarlos disponibles en req.body.

El servidor verifica que los campos estén completos y que la edad sea válida.

Si hay un error, vuelve a mostrar el formulario con un mensaje y conserva los valores ingresados.

Si los datos son correctos, agrega la nueva mascota en memoria y redirige al catálogo.

## Persistencia de los datos

Las mascotas iniciales se cargan desde el archivo datos/mascotas.json.

Las nuevas mascotas se agregan solamente al arreglo que está en memoria mientras el servidor está funcionando.

No se modifica el archivo JSON.

Por eso, cuando se reinicia el servidor, las mascotas agregadas mediante el formulario desaparecen y se vuelven a cargar únicamente las mascotas guardadas originalmente en mascotas.json.