'use strict';
const puppeteer = require('puppeteer');
const functionsProperties = require('../shared/functionsProperties');

module.exports.doScraping = async function (AguasAndinasId,PropertieId) {
	//PUPPETER
	let navigation;
	let selectorDeuda;
	console.log(AguasAndinasId,': doScraping');
	const browser = await puppeteer.launch({});
	const page = await browser.newPage();
	//HOME AGUAS ANDINAS
	await page.goto('https://www.aguasandinas.cl/mi-cuenta/saldo-y-pago');

	const selectorSearch = '#OpensiteControlsaldoSpgascx_Uc_saldo1_Uc_buscar1_txtServicio';
	const selectorButtom = '#OpensiteControlsaldoSpgascx_Uc_saldo1_Uc_buscar1_btnBuscarxCliente';
	//PASOS
	await page.click(selectorSearch);
	await page.type(AguasAndinasId);
	await page.click(selectorButtom);
	await page.waitForNavigation({ timeout: 10000 })
	.then(()=>{
		navigation = true;
		console.log(AguasAndinasId,': Navigation True');
	})
	.catch((error) =>{
		console.log(AguasAndinasId,'Navigation False');
		navigation = false;
	});
	
	//DATA
	const selectorDeudaVencida = '#OpensiteControlsaldoSpgascx_Uc_saldo1_lbl_saldo';
	const selectorFacturaMes = '#OpensiteControlsaldoSpgascx_Uc_saldo1_lbl_fact_mes';
	const selectorTotalporPagar = '#OpensiteControlsaldoSpgascx_Uc_saldo1_lbl_total';
	const selectorFechaEmision = '#OpensiteControlsaldoSpgascx_Uc_saldo1_lblFechaEmision';
	
	if(navigation){

		await page.waitForSelector(selectorDeudaVencida,{ timeout: 15000 })
		.then(()=>{
			return selectorDeuda = true;	
		}).catch((error) =>{
			return selectorDeuda = false;
		});

		if(selectorDeuda){
			let valorFacturaMes = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : null;
		    }, selectorFacturaMes);

			let valorDeudaVencida = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : null;
		    }, selectorDeudaVencida);


		    let valorTotalporPagar = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : null;
		    }, selectorTotalporPagar);

		    let valorFechaEmision = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : null;
		    }, selectorFechaEmision);

		    valorDeudaVencida = await functionsProperties.getOnlyNumbers(valorDeudaVencida);
		    valorTotalporPagar = await functionsProperties.getOnlyNumbers(valorTotalporPagar);
		    valorFechaEmision = await functionsProperties.dateFormatAguasAndinas(valorFechaEmision);
		    valorFacturaMes = await functionsProperties.getOnlyNumbers(valorFacturaMes);


		    let dataPropertie = {
				id: PropertieId,
			    aguasandinas: {
					deudaVencida: valorDeudaVencida,
					totalAdeudado: valorTotalporPagar,
					facturaFecha: valorFechaEmision,
					facturaMonto: valorFacturaMes,
					actualizado: new Date()
			    }
			}
			//RETURN DATA FOR UPSERT PROPERTIE
			browser.close();
			return dataPropertie;
		}else{
			console.log(AguasAndinasId,': No se ha encontrado selector:');
			browser.close();
			return false;
		}
	}else{
		console.log(AguasAndinasId,': No se puede navegar en el sitio:');
		browser.close();
		return false;
	}
	browser.close();
}