import { body } from 'express-validator';

export const validacionPais = () => [
    // Validación para el nombre oficial del país
    body('nombreOficial')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('El nombre oficial es requerido.')
        .isLength({ min: 3, max: 90 })
        .withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.'),

    // Validación para el nombre del país (solo se requiere que no esté vacío)
    body('nombre')
        .notEmpty()
        .withMessage('El nombre del país es requerido.'),

    // Validación para la capital del país
    body('capital')
        .notEmpty().withMessage('La capital es requerida.')
        .trim() // Elimina espacios en blanco al inicio y al final
        .isLength({ min: 2, max: 90 }).withMessage('La capital debe tener entre 2 y 90 caracteres.'),

    // Validación para las fronteras (códigos de 3 letras mayúsculas)
    body('borders')
        .customSanitizer(value => {
            // Si el valor es una cadena, la divide y limpia
            if (typeof value === 'string') {
                return value.split(',').map(b => b.trim()).filter(b => b !== '');
            }
            return value;
        })
        .custom(value => {
            if (value && Array.isArray(value)) {
                for (const border of value) {
                    // Valida que cada elemento sea una cadena de 3 letras mayúsculas
                    if (!/^[A-Z]{3}$/.test(border)) {
                        throw new Error('Cada país fronterizo debe ser un código de 3 letras mayúsculas.');
                    }
                }
            }
            return true;
        }),

    // Validación para el índice Gini (ahora es requerido)
    body('giniIndex')
        .notEmpty() // Se hace obligatorio
        .withMessage('El índice Gini es requerido.')
        .isFloat({ min: 0, max: 100 })
        .withMessage('El valor de Gini debe ser un número entre 0 y 100.'),
    
    // Validación para el año del Gini (ahora es requerido)
    body('giniYear')
        .notEmpty() // Se hace obligatorio
        .withMessage('El año del Gini es requerido.')
        .isLength({ min: 4, max: 4 })
        .withMessage('El año Gini debe ser un número de 4 dígitos.'),

    // Validación para los husos horarios
    body('timezones')
        .customSanitizer(value => {
            if (typeof value === 'string') {
                return value.split(',').map(t => t.trim()).filter(t => t !== '');
            }
            return value;
        })
        .custom(value => {
            if (value && Array.isArray(value) && value.length === 0) {
                throw new Error('Si se proporcionan husos horarios, debe haber al menos uno.');
            }
            return true;
        }),

    // Validación para el área (número positivo)
    body('area')
        .notEmpty()
        .withMessage('El área es requerida.')
        .isFloat({ min: 0 })
        .withMessage('El área debe ser un número positivo.'),

    // Validación para la población (entero positivo)
    body('population')
        .notEmpty()
        .withMessage('La población es requerida.')
        .isInt({ min: 0 })
        .withMessage('La población debe ser un número entero positivo.')
];