'use strict';
const puppeteer = require('puppeteer');
const functionsProperties = require('../shared/functionsProperties');

module.exports.doScraping = async function (EnelId,PropertieId) {
	
	//PUPPETER
	console.log(EnelId,': Actualizando ENEL');
	let selectorDeuda;
	let navigation;
	let caso;
	const browser = await puppeteer.launch({});
	const page = await browser.newPage();
	//HOME ENEL
	console.log(EnelId,': Ir a URL Enel');
	await page.goto('https://www.eneldistribucion.cl/');
	const selectorSearch = '#num_cuenta_0';
	const selectorButtom = '#sendButton';
	//PASOS
	console.log(EnelId,': Click en search Input');
	await page.click(selectorSearch);
	console.log(EnelId,': Tipeando Numero Cliente');
	//await page.type('2793064-6'); //SALDO VIGENTE 1 SELECTOR
	//await page.type('3142570-0'); //DEUDA VENCIDA 2 SELECTORES
	//await page.type('3142567-0'); //SIN DEUDA
	//await page.type('27158617'); //ERROR
	await page.type(EnelId);
	await page.click(selectorButtom);
	console.log(EnelId,': Click search propertie');
	
	const selectorForm = '#formPagar';
	const input1 = '#formPagar > div > div:nth-child(1) > fieldset > div:nth-child(3) > div.col-md-8.col-xs-18.text-right > a';
	const input2 = '#formPagar > div > div:nth-child(1) > fieldset > div:nth-child(5) > div.col-md-8.col-xs-18.text-right > a';

	const fechaVencimiento = '#payOnlineTable > div.row.featured-module-1 > div.col-md-7.col-xs-18 > div.module.block-0.featured-body.body-type-3 > article > div > div > div:nth-child(1) > div.col-md-7.col-md-offset-1.col-xs-18 > p';
	const fechaCorte = '#payOnlineTable > div.row.featured-module-1 > div.col-md-7.col-xs-18 > div.module.block-0.featured-body.body-type-3 > article > div > div > div:nth-child(2) > div.col-md-7.col-md-offset-1.col-xs-18 > p';
	const montoUltimoPago = '#payOnlineTable > div.row.featured-module-1 > div.col-md-7.col-xs-18 > div.module.block-0.featured-body.body-type-3 > article > div > div > div:nth-child(3) > div.col-md-7.col-md-offset-1.col-xs-18 > p';
	const fechaUltimoPago = '#payOnlineTable > div.row.featured-module-1 > div.col-md-7.col-xs-18 > div.module.block-0.featured-body.body-type-3 > article > div > div > div:nth-child(4) > div.col-md-7.col-md-offset-1.col-xs-18 > p';

	const selectorSinDeuda =  '.notification-titletext-0';
	
	//WAIT FOR NAVIGATION
	console.log(EnelId,': Wait for navigation');
	await page.waitForNavigation({ timeout: 10000 })
	.then(()=>{
		navigation = true;
		console.log(EnelId,': Navigation True');
	})
	.catch((error) =>{
		navigation = false;
	});

	if(navigation){
		//LOOK FOR SELECTOR DEUDA
		await page.waitForSelector(selectorForm,{ timeout: 15000 })
		.then(()=>{
			return selectorDeuda = true;	
		}).catch((error) =>{
			return selectorDeuda = false;
		});

		if(selectorDeuda){
			//ENCUENTRA EL SELECTOR DE DEUDA	
			//CHECK CASE
			let caso = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? true : false;
			}, input2);

			//CADA CASO
			if(caso){
				
				let valorDocumentoAnterior = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, input1);

				let valorUltimoDocumento = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, input2);

				let valorfechaVencimiento = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, fechaVencimiento);

				let valorfechaCorte = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, fechaCorte);

				let valormontoUltimoPago = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, montoUltimoPago);

				let valorfechaUltimoPago = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, fechaUltimoPago);

				console.log(EnelId,': 2 SELECTORES');
				/*
				console.log('valorDocumentoAnterior: ',valorDocumentoAnterior);
				console.log('valorUltimoDocumento: ',valorUltimoDocumento);
				console.log('valorfechaVencimiento: ',valorfechaVencimiento);
				console.log('valorfechaCorte: ',valorfechaCorte);
				console.log('valormontoUltimoPago: ',valormontoUltimoPago);
				console.log('valorfechaUltimoPago: ',valorfechaUltimoPago);
				*/
				valorfechaVencimiento = await functionsProperties.dateFormatEnel(valorfechaVencimiento);
		    	valorfechaCorte = await functionsProperties.dateFormatEnel(valorfechaCorte);
		    	valormontoUltimoPago = await functionsProperties.getOnlyNumbers(valormontoUltimoPago);
		    	valorfechaUltimoPago = await functionsProperties.dateFormatEnel(valorfechaUltimoPago);
				valorDocumentoAnterior = await functionsProperties.getOnlyNumbers(valorDocumentoAnterior);
		    	valorUltimoDocumento = await functionsProperties.getOnlyNumbers(valorUltimoDocumento);


				let dataPropertie = {
				id: PropertieId,
			    enel: {
					fechaVencimiento: valorfechaVencimiento,
					fechaCorte: valorfechaCorte,
					montoUltimoPago: valormontoUltimoPago,
					fechaUltimoPago: valorfechaUltimoPago,
					documentoAnterior: valorDocumentoAnterior,
					ultimoDocumento: valorUltimoDocumento,
					actualizado: new Date()
			    	}
				}
				browser.close();
				return dataPropertie;

			}else{

				let valorUltimoDocumento = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, input1);

				let valorfechaVencimiento = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, fechaVencimiento);

				let valormontoUltimoPago = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, montoUltimoPago);

				let valorfechaUltimoPago = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? element.innerHTML : false;
				}, fechaUltimoPago);

				console.log(EnelId,': 1 SOLO SELECTOR');
				/*
				console.log('valorUltimoDocumento: ',valorUltimoDocumento);
				console.log('valorfechaVencimiento: ',valorfechaVencimiento);
				console.log('valorfechaCorte: ',false);
				console.log('valormontoUltimoPago: ',valormontoUltimoPago);
				console.log('valorfechaUltimoPago: ',valorfechaUltimoPago);
				*/
		    	valorfechaVencimiento = await functionsProperties.dateFormatEnel(valorfechaVencimiento);
		    	valormontoUltimoPago = await functionsProperties.getOnlyNumbers(valormontoUltimoPago);
		    	valorfechaUltimoPago = await functionsProperties.dateFormatEnel(valorfechaUltimoPago);
		    	valorUltimoDocumento = await functionsProperties.getOnlyNumbers(valorUltimoDocumento);

				let dataPropertie = {
				id: PropertieId,
			    enel: {
					fechaVencimiento: valorfechaVencimiento,
					fechaCorte: false,
					montoUltimoPago: valormontoUltimoPago,
					fechaUltimoPago: valorfechaUltimoPago,
					documentoAnterior: false,
					ultimoDocumento: valorUltimoDocumento,
					actualizado: new Date()
			    	}
				}
				browser.close();
				return dataPropertie;
			}

		}else{
			//NO EXISTE DEUDA
			let valorSinDeuda = await page.evaluate((sel) => {
				let element = document.querySelector(sel);
				return element ? true : false;
			}, selectorSinDeuda);
			//TEST INVOICE 0 FIELD
			if(valorSinDeuda){
				//NO DEBT
				//CLIENTE AL DIA
				let dataPropertie = {
				id: PropertieId,
			    enel: {
					fechaVencimiento: false,
					fechaCorte: false,
					montoUltimoPago: false,
					fechaUltimoPago: false,
					documentoAnterior: false,
					ultimoDocumento: false,
					actualizado: new Date()
			    	}
				}
				browser.close();
				return dataPropertie;
			}else{
				console.log(EnelId,': No se ha podido validar deuda de propiedad');
				browser.close();
				return false;	
			}
		}
	}else{
		console.log(EnelId,': NAVIGATION FALSE');
		browser.close();
		return false;
	}

	browser.close();
}