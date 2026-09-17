// BLOQUE A IMPORTACIÓN DE HERRAMIENTAS

const express = require("express");
const path = require("node:path");
// esto es para poder usar ejs y layouts
const expressLayouts = require("express-ejs-layouts");
const { leerJson } = require("./archivos");


// BLOQUE B: DATOS FIJOS Y RUTA DEL ARCHIVO JSON

const PORT = 3000;


const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");


// BLOQUE C: FUNCIÓN PRINCIPAL

async function main() {

    // BLOQUE D: LECTURA DE LOS DATOS

    const mascotas = await leerJson(rutaDatos);


    // BLOQUE E: CREACIÓN DE LA APLICACIÓN EXPRESS

    const app = express();


    // BLOQUE F: CONFIGURACIÓN DE LA APLICACIÓN

    //que hace esto? esto le dice a express que use ejs como motor de plantillas
    app.set("view engine", "ejs");
    //que hace esto? esto le dice a express donde estan las vistas, en este caso en la carpeta views que esta en la raiz del proyecto
    app.set("views", path.join(__dirname, "..", "views"));
    //que hace esto? esto le dice a express que use express-ejs-layouts para poder usar layouts en las vistas
    app.use(expressLayouts);
    //que hace esto? esto le dice a express donde estan los layouts, en este caso en la carpeta layouts que esta dentro de la carpeta views
    app.set("layout", "layouts/main");

    //que hace esto? esto le dice a express que use la carpeta public para servir archivos estaticos como css, js, imagenes, etc.
    app.use(express.static(path.join(__dirname, "..", "public")));

    // Permite recibir e interpretar los datos simples enviados desde formularios HTML
    app.use(express.urlencoded({ extended: false }));


    // BLOQUE G: RUTAS DE LA APLICACIÓN, donde inicio se refiere a inicio.ejs y Inicio - Mascotas es el titulo que se le pasa a la vista para que lo muestre en el navegador

    app.get("/", (req, res) => {
        res.render("inicio", {
            titulo: "Inicio - Mascotas",
        });
    });


    //muestra la pagina con el catalogo de mascotas. listaMascotas es el nombre de la variable que se le pasa a la vista para que pueda mostrar los datos de las mascotas. mascotas seria el nombre de la variable que contiene los datos de las mascotas leidos del archivo JSON. En la vista se puede acceder a los datos de las mascotas con <%= listaMascotas %>
    app.get("/mascotas", (req, res) => {
        res.render("mascotas/lista", {
            titulo: "Catálogo de Mascotitas",
            listaMascotas: mascotas
        });
    });


    // Muestra el formulario para agregar una nueva mascota
    app.get("/mascotas/nueva", (req, res) => {
        res.render("mascotas/nueva", {
            titulo: "Agregar una mascota",
            error: null,
            datos: {}
        });
    });

    //-----------------------------------------------------------------------------------------

    // Recibe y procesa los datos enviados desde el formulario y se agrega async porque se va a usar await para escribir en el archivo JSON
    app.post("/mascotas", (req, res) => {
        // Extrae los datos recibidos desde el formulario
        const { nombre, especie, edad, estado, descripcion } = req.body;

        // Limpia los textos y convierte la edad en un número
        const nombreLimpio = String(nombre ?? "").trim();
        const especieLimpia = String(especie ?? "").trim();
        const estadoLimpio = String(estado ?? "").trim();
        const descripcionLimpia = String(descripcion ?? "").trim();
        const edadNumero = Number(edad);

        // Comprueba que todos los campos estén completos
        // y que la edad sea un número igual o mayor que cero
        if (
            !nombreLimpio ||
            !especieLimpia ||
            edad === "" ||
            !estadoLimpio ||
            !descripcionLimpia ||
            !Number.isFinite(edadNumero) ||
            edadNumero < 0
        ) {
            // Si hay un error, vuelve a mostrar el formulario
            return res.status(400).render("mascotas/nueva", {
                titulo: "Agregar una mascota",
                error: "Completá todos los campos con valores válidos.",
                datos: req.body
            });
        }

        // Busca el ID más grande que existe actualmente 
        //reduce()       // Busca el ID más grande
        //push()         // Agrega la nueva mascota al arreglo
        //redirect()     // Lleva al navegador nuevamente al catálogo
        const ultimoId = mascotas.reduce(
            (mayorId, mascota) => Math.max(mayorId, mascota.id),
            0
        );

        // Crea la nueva mascota y la agrega al arreglo en memoria
        mascotas.push({
            id: ultimoId + 1,
            nombre: nombreLimpio,
            especie: especieLimpia,
            edad: edadNumero,
            descripcion: descripcionLimpia,
            estado: estadoLimpio,
            imagen: "/img/mascota.svg"
        });




        // Redirige al catálogo para mostrar la nueva mascota 

        res.redirect("/mascotas");
    });


    //----------------------------------------------------------



    // Busca una mascota por su id y envía sus datos a la vista detalle.ejs
    app.get("/mascotas/:id", (req, res) => {
        const id = Number(req.params.id);
        const mascotaEncontrada = mascotas.find((mascota) => mascota.id === id);
        // Si no existe una mascota con ese id, responde con estado 404

        if (!mascotaEncontrada) {
            return res.status(404).render("no-encontrado", {
                titulo: "Mascota no encontrada"
            });
        }






        res.render("mascotas/detalle", {
            titulo: "Detalle de la mascota",
            mascota: mascotaEncontrada
        });
    });



















    // BLOQUE H: ENCENDIDO DEL SERVIDOR

    app.listen(PORT, () => {
        console.log(`El Servidor esta escuchando en http://localhost: ${PORT}`);
    })

};


// BLOQUE I: EJECUCIÓN Y CAPTURA DE ERRORES

main().catch((error) => {
    console.error("No se pudo iniciar la aplicación:", error);

    process.exitCode = 1;
});
