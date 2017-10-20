'use strict';

const config = require('../../config');
const mongoose = require('mongoose'),
Propertie = mongoose.model('Propertie');

const scrapingEnel = require('../../shared/scrapingEnel');
const scrapingAguasAndinas = require('../../shared/scrapingAguasAndinas');
const functionsProperties = require('../../shared/functionsProperties');


exports.list_all = function(req, res) {
  Propertie.find({}, function(err, propertie) {
    if (err) res.send(err);
    res.json(propertie);
  });
};

exports.create_propertie = function(req, res) {
  let new_propertie = new Propertie(req.body);
  new_propertie.save(function(err, propertie) {
    if (err){ 
      res.send(err);
    }else{
      res.json({ message:'Propiedad creada exitosamente!',status:"done", propertie });
    }
  });
};

exports.read_a_propertie = function(req, res) {
  Propertie.findOne({id:req.params.propertieId}, function(err, propertie) {
    if (err) res.send(err);
    res.json(propertie);
  });
};

exports.update_a_propertie = function(req, res) {
  Propertie.findOneAndUpdate({id: req.params.propertieId}, req.body, {upsert: false,new: true}, function(err, propertie) {
    if (err){ 
      res.send(err);
    }else{
      if(propertie != null){
        res.json({ message:'Propiedad actualizada exitosamente!',status:"done", propertie });
      }else{
        res.json({ message:'Ha ocurrido un error al actulizar la propiedad!',status:"false"});
      }
    }
  });
};

exports.delete_a_propertie = function(req, res) {
  Propertie.remove({id: req.params.propertieId}, function(err) {
    if (err) {
      res.send(err);
    }else{
      res.json({ message: 'Propiedad eliminada exitosamente',status:"done" });
    }
  });
};

exports.scrap_aguasandinas = async function(req, res) {
  let AguasAndinasId = req.params.aguasandinasId;
  let PropertieId = req.params.propertieId;
  let validateClientId = await functionsProperties.checkAccountNumber(AguasAndinasId);
  if(validateClientId){
    console.log(AguasAndinasId,': Numero cliente Valido');
    //PREPARA NUMERO DE CLIENTE PARA WEB
    let AguasAndinasIdforWeb = AguasAndinasId.slice(0, -2);
    var dataFromWeb = await scrapingAguasAndinas.doScraping(AguasAndinasIdforWeb,PropertieId);
    //UPDATE IF SCRAPING IS OK
    if(dataFromWeb != false){   
        Propertie.findOneAndUpdate({id: PropertieId}, dataFromWeb, {upsert: true, new: true}, function(err, propertie) {
        if (err){ 
          res.send(err);
        }else{
          if(propertie != null){
            res.json({ message:'AguasAndinas Scraping exitoso!',status:"done", propertie });
          }else{
            res.json({ message:'Ha ocurrido un error al actulizar la propiedad!',status:"false"});
          }
        }
        });
    }
  }else{
    res.json({ message:'Numero de cliente invalido!',status:"false"});
  }
};

exports.scrap_enel = async function(req, res) {
  let enelId = req.params.enelId;
  let PropertieId = req.params.propertieId;
  let validateClientId = await functionsProperties.checkAccountNumber(enelId);
  if(validateClientId){
    console.log(enelId,': Numero cliente Valido');
    //PREPARA NUMERO DE CLIENTE PARA WEB
    var dataFromWeb = await scrapingEnel.doScraping(enelId,PropertieId);
    //UPDATE IF SCRAPING IS OK
    if(dataFromWeb != false){   
        Propertie.findOneAndUpdate({id: PropertieId}, dataFromWeb, {upsert: true, new: true}, function(err, propertie) {
          if (err){ 
            res.send(err);
          }else{
            if(propertie != null){
              res.json({ message:'Enel Scraping exitoso!',status:"done", propertie });
            }else{
              res.json({ message:'Ha ocurrido un error al actulizar la propiedad!',status:"false"});
            }
          }
        });
    }
  }else{
    res.json({ message:'Numero de cliente invalido!',status:"false"});
  }
};




