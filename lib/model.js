var aug = require('aug');
var Events = require('./events');

var Model = function(name) {
  this.modelName = name;
};

Model.prototype = new Events();

Model.prototype.get = function(key) {
  return this._data[key];
};

Model.prototype.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }).toUpperCase();      
};

Model.prototype.set = function(key, value) {
  if (typeof key !== 'object') {
    this.emit('change:'+key, this._data[key], value);
    this.emit('change', key, this._data[key], value);
    this._data[key] = value;
  } else {
    for (var k in key) {
      this.set(k, key[k]);
    }
  }
};

Model.prototype.toJSON = function() {
  return this._data;
};

Model.create = function(name, obj) {
  var Model = function(params) {
    this.model = Model;
    this._data = aug({}, this.schema, params);
    if (!this._data._id)
      this._data._id = this.guid();
    if (this.init) {
      this.init();
    }
  };
  Model.prototype = new this(name);
  aug(Model.prototype, obj.methods);
  aug(Model, obj.statics);
  Model.applyMixin = function(mixin) {
    aug(this.prototype, mixin.methods);
    aug(Model, mixin.statics);
  };
  return Model;
};

module.exports = Model;

//test
/*
var Person = Model.create('Person', {
  schema: {
    firstName: '',
    lastName: '',
    age: 30
  },
  getFullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }
});
Person.applyMixin({ testMethod: function() {} });
var p = new Person();
console.log(p.testMethod);
var p = new Person({ firstName: 'Bob', lastName: 'Smith' });
var p2 = new Person({ firstName: 'Jane', lastName: 'Jones' });
var p3 = new Person();
console.log(p.getFullName());
console.log(p);
console.log(p2.getFullName());
console.log(p2);
console.log(p3);
*/
