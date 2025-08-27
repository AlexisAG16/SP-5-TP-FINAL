import {
    obtenerPaisPorId,
    obtenerTodosLosPaises,
    obtenerPaisPorNombre,
    crearPais,
    actualizarPais,
    eliminarPais
} from '../services/paisesService.mjs';

import { Types } from 'mongoose'; // Para validar IDs de MongoDB

// ----------------------------------------------------
// CONTROLADORES DE LECTURA (GET)
// ----------------------------------------------------

export async function obtenerTodosLosPaisesController(req, res) {
    try {
        const paises = await obtenerTodosLosPaises();

        if (req.accepts('html')) {
            // Si el cliente prefiere HTML (navegador), renderiza el dashboard
            res.render('dashboard', { paises: paises });
        } else if (req.accepts('json')) {
            // Si el cliente prefiere JSON (Postman), envía los datos
            res.json(paises);
        } else {
            res.status(406).send('No Aceptable: Solo se soportan respuestas HTML o JSON.');
        }
    } catch (error) {
        console.error('Error en obtenerTodosLosPaisesController:', error);
        res.status(500).send({ mensaje: 'Error al obtener los paises', error: error.message });
    }
}


export async function obtenerPaisPorIdController(req, res) {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            if (req.accepts('json')) {
                return res.status(400).json({ message: 'ID de pais no válido.' });
            }
            return res.status(400).send('ID de pais no válido.');
        }

        const pais = await obtenerPaisPorId(id);

        if (!pais) {
            if (req.accepts('json')) {
                return res.status(404).json({ message: 'País no encontrado.' });
            }
            return res.status(404).send('País no encontrado.');
        }

        if (req.accepts('html')) {
            res.redirect('/api/paises');
        } else if (req.accepts('json')) {
            res.json(pais);
        } else {
            res.status(406).send('No Aceptable: Solo se soportan respuestas HTML o JSON.');
        }
    } catch (error) {
        console.error('Error en obtenerPaisPorIdController:', error);
        res.status(500).send({ mensaje: 'Error al obtener el país', error: error.message });
    }
}

// ----------------------------------------------------
// CONTROLADORES DE FORMULARIOS (Siempre HTML)
// ----------------------------------------------------

export async function formAgregarPaisController(req, res) {
    try {
        res.render('agregarPais');
    } catch (error) {
        console.error('Error al renderizar el formulario para agregar país:', error);
        res.status(500).send('Error interno al cargar el formulario.');
    }
}

// Controlador para mostrar el formulario de búsqueda
export function formBuscarPorNombreController(req, res) {
    try {
        console.log('Mostrando formulario para buscar pais por nombre.');
        res.render('buscarPorNombre', { layout: 'layout', mensaje: null });
    } catch (error) {
        console.error('Error al mostrar el formulario de búsqueda:', error);
        res.status(500).send({ mensaje: 'Error interno al cargar la página.' });
    }
}

// Controlador para procesar la búsqueda por nombre
export async function buscarPorNombreController(req, res) {
    try {
        const nombrePais = req.query.nombre;
        if (!nombrePais) {
            return res.status(400).json({ error: 'El nombre del país es obligatorio.' });
        }

        const paises = await obtenerPaisPorNombre(nombrePais);

        if (paises && paises.length > 0) {
            return res.status(200).json({ paises: paises });
        } else {
            return res.status(404).json({ paises: [], message: 'País no encontrado.' });
        }

    } catch (error) {
        console.error('Error al buscar el país:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export async function formActualizarPaisController(req, res) {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID del país no válido para edición.');
        }
        const pais = await obtenerPaisPorId(id);

        if (!pais) {
            return res.status(404).send('País no encontrado para editar.');
        }

        res.render('editarPais', { pais });
    } catch (error) {
        console.error('Error en formActualizarPaisController:', error);
        res.status(500).send('Error interno al cargar el formulario de edición.');
    }
}

export async function confirmarEliminacionController(req, res) {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID del país no válido para confirmación.');
        }

        const pais = await obtenerPaisPorId(id);

        if (!pais) {
            return res.status(404).send('País no encontrado para confirmar eliminación.');
        }

        res.render('confirmarEliminacion', { info: pais });
    } catch (error) {
        console.error('Error en confirmarEliminacionController:', error);
        res.status(500).send({ mensaje: 'Error interno al cargar la página de confirmación.' });
    }
}

// ----------------------------------------------------
// CONTROLADORES DE ESCRITURA (POST, PUT, DELETE)
// ----------------------------------------------------

export async function agregarPaisController(req, res) {
    try {

        // Extraemos todos los campos del cuerpo de la solicitud.
        // Asignamos valores por defecto a los arrays si no existen.
        const {
            nombre,
            nombreOficial,
            capital,
            population,
            area,
            borders,
            timezones,
            giniIndex,
            giniYear,
            creador
        } = req.body;

        // Creamos el objeto final que será enviado al servicio.
        // Incluimos todos los datos y nos aseguramos de que los arrays esten en el formato correcto
        const nuevoPaisData = {
            nombre,
            nombreOficial,
            capital,
            population,
            area,
            borders: borders || [], // Si 'borders' es nulo, usamos un array vacío.
            timezones: timezones || [], // Si 'timezones' es nulo, usamos un array vacío.
            creador
        };

        // Solo se agrega 'gini' si ambos valores (indice y año) están presentes.
        if (giniIndex && giniYear) {
            nuevoPaisData.gini = {
                // Usamos una propiedad con el año como clave.
                [giniYear]: parseFloat(giniIndex)
            };
        }
        const nuevoPais = await crearPais(nuevoPaisData);

        if (req.accepts('html')) {
            res.redirect('/api/paises'); // Redirige al dashboard HTML
        } else if (req.accepts('json')) {
            res.status(201).json(nuevoPais);
        } else {
            res.status(406).send('No Aceptable: Solo se soportan respuestas HTML o JSON.');
        }
    } catch (error) {
        console.error('Error en agregarPaisController:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            if (req.accepts('json')) {
                return res.status(400).json({ message: 'Errores de validación', errors });
            } else {
                return res.status(400).send('Error de validación: ' + errors.join(', '));
            }
        }
        res.status(500).send({ mensaje: 'Error al crear un país nuevo', error: error.message });
    }
}

export async function actualizarPaisController(req, res) {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            if (req.accepts('json')) {
                return res.status(400).json({ message: 'ID del país no válido.' });
            }
            return res.status(400).send('ID del país no válido.');
        }

        const datosActualizados = {
            ...req.body,
            borders: req.body.borders || [],
            timezones: req.body.timezones || [],
        };

        // Si el formulario contiene ambos campos, se crea el objeto 'gini'
        if (req.body.giniIndex && req.body.giniYear) {
            datosActualizados.gini = {
                [req.body.giniYear]: parseFloat(req.body.giniIndex)
            };
        } else {
            // Si el usuario borra el valor, se elimina el campo del documento
            datosActualizados.$unset = { gini: "" };
        }

        const paisActualizado = await actualizarPais(id, datosActualizados);

        if (!paisActualizado) {
            if (req.accepts('json')) {
                return res.status(404).json({ message: 'País no encontrado para actualizar.' });
            }
            return res.status(404).send('País no encontrado para actualizar.');
        }

        if (req.accepts('html')) {
            res.redirect('/api/paises');
        } else if (req.accepts('json')) {
            res.json(paisActualizado);
        } else {
            res.status(406).send('No Aceptable: Solo se soportan respuestas HTML o JSON.');
        }
    } catch (error) {
        console.error('Error en actualizarPaisController:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            if (req.accepts('json')) {
                return res.status(400).json({ message: 'Errores de validación', errors });
            } else {
                return res.status(400).send('Error de validación: ' + errors.join(', '));
            }
        }
        res.status(500).send({ mensaje: 'Error al modificar el país', error: error.message });
    }
}

export async function eliminarPaisController(req, res) {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            if (req.accepts('json')) {
                return res.status(400).json({ message: 'ID del país no válido.' });
            }
            return res.status(400).send('ID del país no válido.');
        }

        const paisEliminado = await eliminarPais(id);

        if (!paisEliminado) {
            if (req.accepts('json')) {
                return res.status(404).json({ message: 'País no encontrado para eliminar.' });
            }
            return res.status(404).send('País no encontrado para eliminar.');
        }

        if (req.accepts('html')) {
            res.redirect('/api/paises');
        } else if (req.accepts('json')) {
            res.status(200).json({ message: 'País eliminado correctamente', deletedCountry: paisEliminado });
        } else {
            res.status(406).send('No Aceptable: Solo se soportan respuestas HTML o JSON.');
        }
    } catch (error) {
        console.error('Error en eliminarPaisController:', error);
        res.status(500).send({ mensaje: 'Error al eliminar el país.', error: error.message });
    }
}