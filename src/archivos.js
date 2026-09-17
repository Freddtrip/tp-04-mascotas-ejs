const fs = require ("node:fs/promises");

async function leerJson (ruta){
    const contenido = await fs.readFile(ruta, "utf8");
    return JSON.parse(contenido);
}







// Guarda datos dentro de un archivo JSON
async function escribirJson(ruta, datos) {
    const contenido = JSON.stringify(datos, null, 2);

    await fs.writeFile(ruta, contenido, "utf8");
}


module.exports = {leerJson, escribirJson};