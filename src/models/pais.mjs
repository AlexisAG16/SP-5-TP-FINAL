import mongoose from 'mongoose';

const paisSchema = new mongoose.Schema({
    nombre: String,
    nombreOficial: String,
    capital: String,
    borders: [String],
    area: Number,
    population: Number,
    gini: 
    {
    type: Object, // Objeto
    required: false
    },
    timezones: [String],
    creador: String
});

const pais = mongoose.model('Pais',paisSchema,'Grupo-09');

export default pais;