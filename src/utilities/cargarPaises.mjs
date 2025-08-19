import pais from '../models/pais.mjs';
import fetch from 'node-fetch';

// Exporta la función para cargar datos de la API y guardarlos en MongoDB
export const cargarPaises = async () => {
    try {
        // Verifica si la base de datos ya contiene países
        const totalPaises = await pais.countDocuments();
        if (totalPaises > 0) {
            console.log(`ADVERTENCIA : La base de datos ya contiene ${totalPaises} países. No se realizarán cambios.`);
            return;
        }

        console.log('Base de datos de países vacía. Cargando datos desde la API...');

        // Llama a la API externa
        const apiUrl = 'https://restcountries.com/v3.1/region/america';
        const response = await fetch(apiUrl);

        // Importante: Verifica si la respuesta de la API fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const paises = await response.json();

        // Filtra y mapea los datos
        const paisesHispanoamericanos = paises.filter(pais => pais.languages && pais.languages.spa);
        const paisesSeleccionados = paisesHispanoamericanos.map(pais => ({
            nombre: pais.name.common,
            nombreOficial: pais.name.official,
            capital: pais.capital ? pais.capital[0] : 'No disponible',
            borders: pais.borders || [],
            area: pais.area,
            population: pais.population,
            gini: pais.gini || null,
            timezones: pais.timezones,
            creador: "alexis"
        }));

        // Guarda los datos en la base de datos
        await pais.insertMany(paisesSeleccionados);
        console.log(`Se han guardado ${paisesSeleccionados.length} países en la base de datos.`);
    } catch (error) {
        console.error('Error al cargar los datos de los países:', error);
    }
};