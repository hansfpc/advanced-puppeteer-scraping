'use strict';
const mongoose = require('mongoose');

let aguasandinasSchema = new mongoose.Schema({
		facturaFecha: { type: String, default: null},
		facturaMonto: { type: String, default: null},
		deudaVencida: { type: String, default: null},
		totalAdeudado: { type: String, default: null},
		actualizado: { type: Date, default: Date.now }
});
let enelSchema = new mongoose.Schema({
	fechaVencimiento: { type: String, default: null},
	fechaCorte: { type: String, default: null},
	montoUltimoPago: { type: String, default: null},
	fechaUltimoPago: { type: String, default: null},
	documentoAnterior: { type: String, default: null},
	ultimoDocumento: { type: String, default: null},
	actualizado: { type: Date, default: Date.now }
});

let propertieSchema = new mongoose.Schema({
	nombre: {type: String, default: null},
	id: {type: String, required : true,  index:true, unique : true},
	numeroCuentaEnel:{type: String},
	numeroCuentaAguasAndinas:{type: String},
    edificio: { type: String, default: null},
    departamento:{ type: String, default: null},
    aguasandinas: [aguasandinasSchema],
    enel: [enelSchema]
});

let Propertie = mongoose.model('Propertie', propertieSchema);
Propertie.on('index', function (err) {
  if (err) console.error(err);
})

module.exports = Propertie;

