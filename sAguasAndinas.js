const config = require('./config');
const scrapingAguasAndinas = require('./shared/scrapingAguasAndinas');
const functionsProperties = require('./shared/functionsProperties');
const mailing = require('./config/mailing.js');
process.setMaxListeners(0);

async function MasterFunctionScrapingAguasAndinas(){
	var restartFunction = 1;
	console.log('/////**** Comienza MasterFunctionScrapingAguasAndinas ****/////');
	await functionsProperties.getAllProperties()
	.then(ListProperties => ListadoDePropiedades = ListProperties)
	.catch(err => ListadoDePropiedades = false)
	//Qty properties
	if(ListadoDePropiedades){
		let qtyProperties = ListadoDePropiedades.length;
		console.log('QTY de propiedades a Actualizar:',qtyProperties);
		console.log('Intervalo por propiedad:',config.intervalAguasAndinas);
		for (let i = 0; i < qtyProperties; i++) {
			setTimeout( async function (i) {
				AguasAndinasId = ListadoDePropiedades[i].numeroCuentaAguasAndinas;
				//VALIDA NUMERO DE CLIENTE
				let validateClientId = await functionsProperties.checkAccountNumber(AguasAndinasId);
	           	if(validateClientId){
	           		console.log(AguasAndinasId,': Numero cliente Valido');
	           		//PREPARA NUMERO DE CLIENTE PARA WEB
					AguasAndinasIdforWeb = AguasAndinasId.slice(0, -2);
					PropertieId = ListadoDePropiedades[i].id;
					var dataFromWeb = await scrapingAguasAndinas.doScraping(AguasAndinasIdforWeb,PropertieId);
		           	//UPDATE IF SCRAPING IS OK
		           	if(dataFromWeb != false){
		           		console.log(AguasAndinasId,': Datafrom Web:',dataFromWeb);
		           		functionsProperties.upsertPropertie(dataFromWeb);
		           	}else{
						var subjectformail = PropertieId + ': Error Scraping AguasAndinasID -> ' + AguasAndinasId;
						mailing.sendEmail(subjectformail,'Ha ocurrido un error al realizar el scraping de la propiedad');
		           	}
				}else{
					console.log(AguasAndinasId,': Numero cliente invalido');
					var subjectformail = PropertieId + ': Numero de cliente AguasAndinas invalido';
		           	mailing.sendEmail(subjectformail,'No se ha podido inicializar el scraping de la propiedad');
				}
	           	//SCRAPEA WEB AGUAS ANDINAS 
	           	console.log(AguasAndinasId,': Finalizado ',restartFunction,' de ', qtyProperties);
	           	if(restartFunction == qtyProperties){
	           		console.log('/////**** Termina MasterFunctionScrapingAguasAndinas ****/////');
	           		Again();
	           	}
	           	restartFunction++;
		    },config.intervalAguasAndinas * i, i);//TIMEOUT
		}//END FOR	
	}//LISTO TRUE
}

MasterFunctionScrapingAguasAndinas();

function Again(){
	MasterFunctionScrapingAguasAndinas();
}