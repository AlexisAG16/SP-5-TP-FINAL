import pais from '../models/pais.mjs';
import IRepository from './IRepository.mjs';

class paisesRepository extends IRepository
{
    async obtenerPorId(id)
    {
        const encontrarPorId = await pais.findById(id);
        console.log(encontrarPorId);

        return encontrarPorId;
    }

    // Parte del CRUD para obtener o leer todos
    async obtenerTodos()
    {
        const paisesEncontrados = await pais.find({
            creador: "alexis"
        });

        return paisesEncontrados;
    }

    /*async buscarPorAtributo(atributo, valor) 
    {
    const schemaType = superHero.schema.paths[atributo].instance;
    let query;

    if (schemaType === 'Number') {
    query = { [atributo]: parseInt(valor) };
    if (isNaN(query[atributo])) {
      return [];
    }
    } else {
    query = { [atributo]: { $regex: valor, $options: 'i' } };
    }

    const atributoValor = await superHero.find(query);
    return atributoValor;
}

    async obtenerMayoresDe30() 
    {
        const superheroeEncontrado = await superHero.find
        ({
        edad: { $gt: 30 },
        planetaOrigen: 'Tierra',
        $expr: { $gte: [{ $size: "$poderes" }, 2]}
        // poderes: { $exists: true, $size: { $gte: 2 }},
        });
        return superheroeEncontrado;
    }*/

async obtenerPorNombre(nombre) {
    // Usamos una expresión regular para una búsqueda flexible e insensible a mayúsculas
    // La opción 'i' es para case-insensitive
    const query = { nombre: { $regex: new RegExp(nombre, 'i') } };

    query.creador = 'alexis';

    // .find() devuelve un array con todos los documentos que coinciden, no solo el primero.
    const paises = await pais.find(query);

    return paises;
}


    // CRUD

    async crearPais(objetoPais)
    {
        const nuevoPais = new pais(objetoPais);
        const paisCreado = await nuevoPais.save();
        console.log(paisCreado);
        return paisCreado;
    }

    async actualizarPais(id,datosActualizados)
    {
        const paisActualizado = await pais.findByIdAndUpdate(
            id, 
            datosActualizados,
            {
                new: true,        
                runValidators: true 
            }
        );
        return paisActualizado;
    }

    async eliminarPais(id) {
        const paisEliminado = await pais.findByIdAndDelete(id);
        return paisEliminado;
}
}

export default new paisesRepository();