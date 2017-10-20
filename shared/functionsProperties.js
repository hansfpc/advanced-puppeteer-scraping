const { mongoose } = require('../db/mongoose');
const Propertie = require('../api/models/propertieModel');



module.exports.upsertPropertie = function(propertieObj) {
	//console.log(propertieObj);
    // if this id exists, update the entry, don't insert
	let conditions = { "id" : propertieObj.id };
	let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  	Propertie.findOneAndUpdate(conditions, propertieObj, options, (err, result) => {
  		if (err) throw err;
  	});	
}

module.exports.getAllProperties = function(){
	 return Propertie.find({}).then(ListProperties => {return ListProperties;});
}

module.exports.checkAccountNumber = function(accountNumber){
	let canRegex = new RegExp(/^\d{7}-\w$/);
	let res = canRegex.test(accountNumber);
	return res;
}

module.exports.getOnlyNumbers = function(string){
	//let gonRegex = new RegExp(/\d+/g);
	let res = string.replace(/[^0-9]/g, '')
	return res;
}

module.exports.dateFormatEnel = function(string){
		let ds = string;
		let emonth = ds.split(" ")[1];
		let eday = ds.split(" ")[2];
		let eyear = ds.split(" ")[5];
		let javaMonths = {'Jan':01,'Feb':02,'Mar':03,'Abr':04,'May':05,'Jun':06,'Jul':07,'Aug':08,'Sep':09,'Oct':10,'Nov':11,'Dec':12};   
		emonth = javaMonths[emonth];   
		let res = new Date (eyear, emonth-1, eday);
		return res;
}

module.exports.dateFormatAguasAndinas = function(string){
	let ds = string;
	ds = ds.replace("(", "");
	ds = ds.replace(")", "");
	let eday = ds.split("-")[0];
	let emonth = ds.split("-")[1];
	let eyear = ds.split("-")[2];
	let res = new Date (eyear, emonth-1, eday);
	return res;
}


