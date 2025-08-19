class IRepository {
    obtenerPorId(id)
    {
        throw new Error ("Metodo 'obtenerPorId()' no implementado");
    }
    obtenerTodos()
    {
        throw new Error ("Metodo 'obtenerTodos()' no implementado");
    }
    obtenerPorNombre()
    {
        throw new Error ("Metodo 'obtenerPorNombre(nombre)' no implementado");
    }
    /*buscarPorAtributo(atributo,valor)
    {
        throw new Error ("Metodo 'buscarPorAtributo()' no implementado");
    }
    obtenerMayoresDe30()
    {
        throw new Error ("Metodo 'obtenerMayoresDe30()' no implementado");
    }*/
    crearPais()
    {
        throw new Error ("Metodo 'crearPais()' no implementado");
    }
    actualizarPais()
    {
        throw new Error ("Metodo 'actualizarPais()' no implementado");
    }
    eliminarPais()
    {
        throw new Error ("Metodo 'eliminarPais()' no implementado");
    }
}

export default IRepository;
