var expect = require('chai').expect;


var Model = require('../lib/model');

describe('model', function() {

  var Person;   
  beforeEach(function() {
    Person = Model.create('Person', {
      schema: {
        firstName: '',
        lastName: '',
        age: 30
      }
    });
  });

  describe('constructor', function() {

    it('should set default values', function() {
      var p = new Person({});
      expect(p._data.age).to.equal(30);
    });

    it('should take in attributes', function() {
      var p = new Person({ firstName: 'Joe', lastName: 'Smith' });
      expect(p._data.firstName).to.equal('Joe');
      expect(p._data.lastName).to.equal('Smith');
    });

    it('should set modelName', function() {
      var p = new Person({ firstName: 'Joe', lastName: 'Smith' });
      expect(p.modelName).to.equal('Person');
    });

    it('should create a unique _id', function() {
      var p = new Person();
      var id1 = p._data._id;
      var p2 = new Person();
      var id2 = p2._data._id;
      expect(id1).to.not.equal(id2);
    });
    
  });

  describe('#get', function() {

    it('should return value from data', function() {
      var p = new Person({ firstName: 'Joe', lastName: 'Smith' });
      expect(p.get('firstName')).to.equal('Joe');
      expect(p.get('lastName')).to.equal('Smith');
    });
  });

  describe('#set', function() {
    it('should take in a key and value', function() {
      var p = new Person({ firstName: 'Joe', lastName: 'Smith' });
      p.set('firstName', 'Bob');
      expect(p._data.firstName).to.equal('Bob');
      expect(p.get('firstName')).to.equal('Bob');
    });
    
    it('should take in an object', function() {
      var p = new Person({ });
      p.set({
        firstName: 'Bob',
        lastName: 'Jones'
      });
      expect(p._data.firstName).to.equal('Bob');
      expect(p.get('firstName')).to.equal('Bob');
      expect(p._data.lastName).to.equal('Jones');
      expect(p.get('lastName')).to.equal('Jones');
    });

    it('should emit an event', function() {
      var eventCount = 0;
      var p = new Person({ firstName: 'Joe', lastName: 'Smith' });
      p.on('change', function(key, oldValue, newValue) {
        eventCount++;
        expect(key).to.equal('firstName');
        expect(oldValue).to.equal('Joe');
        expect(newValue).to.equal('Bob');
        expect(this).to.equal(p);
      });
      p.on('change:firstName', function(oldValue, newValue) {
        eventCount++;
        expect(oldValue).to.equal('Joe');
        expect(newValue).to.equal('Bob');
        expect(this).to.equal(p);
      });
      p.set('firstName', 'Bob');
      expect(eventCount).to.equal(2);
    });
  });

  describe('#applyMixin', function() {
    it('should applyMixin', function() {
      var mixin = {
        statics: {
          staticMethod: function() {
          }
        },
        methods: {
          someMethod: function() {
          }
        }
      };
      Person.applyMixin(mixin);
      var p = new Person();
      expect(p.someMethod).to.exist;
      expect(Person.staticMethod).to.exist;
    });
    
  });

  describe('toJSON', function() {
    it('should convert object to json', function() {
      var p = new Person();
      delete p._data._id; //remove for unit test
      expect(p.toJSON()).to.eql({ firstName: '', lastName: '', age: 30 });
      
    });
    
  });

});
