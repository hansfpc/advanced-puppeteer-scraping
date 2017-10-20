let mongoose = require("mongoose");
let Propertie = require('../api/models/propertieModel');

let chai = require('chai');
let chaiHttp = require('chai-http');

let app = require('../server').app;
let should = chai.should();

chai.use(chaiHttp);

describe('Server', () => {

  beforeEach((done) => {
      Propertie.remove({}, (err) => { 
         done();         
      });     
  });
  describe('/GET Properties', () => {
      it('it should GET all the properties', (done) => {
        chai.request(app)
            .get('/api/properties')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/POST Propertie', () => {
        it('it should not POST a propertie without id field', (done) => {
          let propertie = {
            //id:'1', 
            OP:'RSD201', 
            departamento:'201',
            numeroCuentaAguasAndinas: '2342342',
            numeroCuentaEnel: '32423423'
          }

          chai.request(app)
              .post('/api/properties')
              .send(propertie)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('errors');
                  res.body.errors.should.have.property('id');
                  res.body.errors.id.should.have.property('kind').eql('required');
                done();
              });
        });
        it('it should POST a propertie ', (done) => {
        let propertie = {
            id:'1', 
            nombre:'Test Nombre',
            edificio: 'Test edificio',
            departamento: 'Test Departamento'
        }
        chai.request(app)
            .post('/api/properties')
            .send(propertie)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('done');
                res.body.propertie.should.have.property('id');
              done();
            });
        });
  });
  describe('/GET Propertie', () => {
      it('it should GET a propertie', (done) => {
        var newPropertie = new Propertie({
          id:'2', 
          nombre:'Test2 Nombre2',
          edificio: 'Test2 edificio2',
          departamento: 'Test2 Departamento2'
        });
        newPropertie.save(function(err, data) {
          chai.request(app)
          .get('/api/properties/'+data.id)
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('nombre');
            res.body.should.have.property('edificio');
            res.body.should.have.property('departamento');
            res.body.nombre.should.equal('Test2 Nombre2');
            res.body.edificio.should.equal('Test2 edificio2');
            res.body.departamento.should.equal('Test2 Departamento2');
            res.body.id.should.equal(data.id);
            done();
          });
        });
      });
  });

  describe('/PUT Propertie', () => {
    it('it should UPDATE a single propertie', (done) => {
    var newProperties = new Propertie({
        id:'3', 
        nombre:'Test3 Nombre3',
        edificio: 'Test3 edificio3',
        departamento: 'Test3 Departamento3'
    });
    newProperties.save(function(err, data) {
        chai.request(app)
        .put('/api/properties/3')
        .send({'nombre': 'Spider'})
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.propertie.should.have.property('nombre');
          res.body.propertie.should.have.property('id');
          res.body.propertie.nombre.should.equal('Spider');
          res.body.status.should.equal('done');
          done();
        });
      });
    });
  });

  describe('/DELETE Propertie', () => {
    it('it should delete a single propertie', (done) => {
    var newProperties = new Propertie({
        id:'4', 
        nombre:'Test4 Nombre4',
        edificio: 'Test4 edificio4',
        departamento: 'Test4 Departamento4'
    });
    newProperties.save(function(err, data) {
        chai.request(app)
        .delete('/api/properties/4')
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('done');
          done();
        });
      });
    });
  });

});

