'use strict';
module.exports = function(app) {
  const properties = require('../controllers/propertieController');

  // todoList Routes
  app.route('/api/properties')
    .get(properties.list_all)
    .post(properties.create_propertie);

  app.route('/api/properties/:propertieId')
    .get(properties.read_a_propertie)
    .put(properties.update_a_propertie)
    .delete(properties.delete_a_propertie);

  app.route('/api/scrapaguasandinas/:aguasandinasId/:propertieId')
    .get(properties.scrap_aguasandinas)

  app.route('/api/scrapenel/:enelId/:propertieId')
    .get(properties.scrap_enel)
};