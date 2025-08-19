import express from 'express';
import { validacionPais } from '../validation/validacionPaises.mjs';
import { handleValidationErrors } from '../validation/errorMiddleware.mjs';
import {
    obtenerTodosLosPaisesController,
    obtenerPaisPorIdController,

    formBuscarPorNombreController,
    formAgregarPaisController,
    formActualizarPaisController,
    confirmarEliminacionController,

    buscarPorNombreController,
    agregarPaisController,
    actualizarPaisController,
    eliminarPaisController,
} from '../controllers/paisesController.mjs';

const router = express.Router();

router.get('/', (req, res) => res.render('index'));

router.get('/paises',obtenerTodosLosPaisesController);
router.get('/paises/:id',obtenerPaisPorIdController);

router.get('/formBuscarPorNombre', formBuscarPorNombreController);
router.get('/formAgregarPais',formAgregarPaisController);
router.get('/formEditarPais/:id',formActualizarPaisController);
router.get('/confirmarEliminar/:id', confirmarEliminacionController);

router.get('/buscarPais', buscarPorNombreController);

router.post('/AgregarPais',
    validacionPais(),
    handleValidationErrors ,
    agregarPaisController);

router.put('/ActualizarPais/:id',
    validacionPais(),
    handleValidationErrors ,
    actualizarPaisController);

router.delete('/EliminarPais/:id', eliminarPaisController);

router.get('/about', (req, res) => res.render('acercade'));
router.get('/contact', (req, res) => res.render('contacto'));


export default router;