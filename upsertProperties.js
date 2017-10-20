const config = require('./config');
const { mongoose } = require('./db/mongoose');
const Propertie = require('./api/models/propertieModel');
const propertiesarraydev = require ('./db/properties_development.json');
const propertiesarrayprod = require ('./db/properties.json');

if (config.env == 'development') {
 	propertiesarray = propertiesarraydev;
}else{
	propertiesarray = propertiesarrayprod;	
}

var listLength = propertiesarray.length;

for (let i = 0; i < listLength; i++) {
	upsertPropertie({
		id:propertiesarray[i].id,
		nombre:propertiesarray[i].nombre, 
		numeroCuentaAguasAndinas: propertiesarray[i].nro_cliente_agua,
		numeroCuentaEnel: propertiesarray[i].nro_cliente_luz,
	    actualizado: new Date()
	});
}
function upsertPropertie(propertieObj) {
	let conditions = { id : propertieObj.id };
	let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  	Propertie.findOneAndUpdate(conditions, propertieObj, options, (err, result) => {
  		if (err) throw err;
  	});
}







