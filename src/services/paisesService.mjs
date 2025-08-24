import paisesRepository from '../repository/paisesRepository.mjs';

export async function obtenerPaisPorId(id)
{
    const obtenerId = await paisesRepository.obtenerPorId(id);
    return obtenerId;
}

export async function obtenerTodosLosPaises()
{
    const RepoObtenerTodos = await paisesRepository.obtenerTodos();

    return RepoObtenerTodos;
}

export async function obtenerPaisPorNombre(nombre) {
    return await paisesRepository.obtenerPorNombre(nombre);
}

export async function crearPais(objetoPais)
{
    return await paisesRepository.crearPais(objetoPais);
}

export async function actualizarPais(id,datos)
{
    return await paisesRepository.actualizarPais(id,datos);
}

export async function eliminarPais(id) 
{
    return await paisesRepository.eliminarPais(id);
}