const config = require('./config');
const scrapingEnel = require('./shared/scrapingEnel');
const functionsProperties = require('./shared/functionsProperties');
const mailing = require('./config/mailing.js');
process.setMaxListeners(0);

async function MasterFunctionScrapingEnel(){
	//
	var restartFunction = 1;
	console.log('/////**** Comienza MasterFunctionScrapingEnel ****/////');
	await functionsProperties.getAllProperties()
	.then(ListProperties => ListadoDePropiedades = ListProperties)
	.catch(err => ListadoDePropiedades = false)
	//Qty properties
	if(ListadoDePropiedades){
		let qtyProperties = ListadoDePropiedades.length;
		console.log('QTY de propiedades a Actualizar:',qtyProperties);
		console.log('Intervalo por propiedad:',config.intervalEnel);
		//INTERVALO DE EJECUCION
		var interval = 20000; // 10 seconds;
		for (let i = 0; i < qtyProperties; i++) {
			setTimeout( async function (i) {
					EnelId = ListadoDePropiedades[i].numeroCuentaEnel;
					PropertieId = ListadoDePropiedades[i].id;
					let validateClientId = await functionsProperties.checkAccountNumber(EnelId);
			        if(validateClientId && EnelId != ''){
			           	//SCRAPEA WEB ENEL
			           	console.log(EnelId,': Numero cliente Valido');
			           	var dataFromWeb = await scrapingEnel.doScraping(EnelId,PropertieId);
			           	//UPDATE IF SCRAPING IS OK
			           	if(dataFromWeb != false){
			           		console.log(EnelId,': Datafrom Web:',dataFromWeb);
			           		functionsProperties.upsertPropertie(dataFromWeb);
			           	}else{
			           		var subjectformail = PropertieId + ': Error Scraping EnelID -> ' + EnelId;
			           		mailing.sendEmail(subjectformail,'Ha ocurrido un error al realizar el scraping de la propiedad');
			           	}
			        }else{
						console.log(EnelId,': Numero cliente invalido');
						var subjectformail = PropertieId + ': Numero de cliente ENEL invalido';
		           		mailing.sendEmail(subjectformail,'No se ha podido inicializar el scraping de la propiedad');
					}
			        console.log(EnelId,': Finalizado ',restartFunction,' de ', qtyProperties);
		           	
		           	if(restartFunction == qtyProperties){
		           		console.log('/////**** Termina MasterFunctionScrapingEnel ****/////');
		           		Again();
		           	}
		           	restartFunction++;
		    }, config.intervalEnel * i, i);//TIMEOUT
		}//END FOR	
	}//LISTADO TRUE
}

MasterFunctionScrapingEnel();

function Again(){
	MasterFunctionScrapingEnel();
}