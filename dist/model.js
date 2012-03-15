var SuperModel = (function(exports) {
/*!
  * aug.js - A javascript library to extend existing objects and prototypes 
  * v0.0.1
  * https://github.com/jgallen23/aug
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('aug', function() {

var aug = function __aug() {
  var args = Array.prototype.slice.call(arguments);
  var org = args.shift();
  for (var i = 0, c = args.length; i < c; i++) {
    var prop = args[i];
    for (var name in prop) {
      org[name] = prop[name];
    }
  }
  return org;
};

return aug;
});

var cs2 = (function(exports) {
var Events = function() {
  this.cache = {}; 
};
Events.prototype.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var topic = args.shift();
  var subs = this.cache[topic], len = subs ? subs.length : 0;

  while(len--){
    subs[len].apply(this, args || []);
  }
};
Events.prototype.on = function(topic, callback) {
  if(!this.cache[topic]){
    this.cache[topic] = [];
  }
  this.cache[topic].push(callback);
  return [topic, callback]; // Array
};
Events.prototype.off = function(handle) {
  var subs = this.cache[handle[0]],
  callback = handle[1],
  len = subs ? subs.length : 0;

  while(len--){
    if(subs[len] === callback){
      subs.splice(len, 1);
    }
  }
};
exports = Events;

return exports;
})({});
var cs3 = (function(exports) {
var aug = window.aug;

var Collection = function(name) {
  this.name = name;
};

Collection.prototype.forEach = function(callback) {
  var i = 0;
  for (var key in this.items) {
    callback(this.items[key], i++);
  }
};

Collection.prototype.all = function() {
  var items = [];
  this.forEach(function(item) {
    items.push(item);
  });
  return items;
};

Collection.prototype.get = function(id) {
  return this.items[id];
};


Collection.prototype.filter = function(f) {
  var items = [];
  this.forEach(function(item, i) {
    if (f(item))
      items.push(item);
  });
  return items;
};

Collection.prototype.toJSON = function() {
  var json = {};
  for (var id in this.items) {
    json[id] = this.items[id].toJSON();
  }
  return json;
};

Collection.prototype.add = function(item) {
  this.items[item.get('_id')] = item;
};

Collection.prototype.remove = function(item) {
  if (typeof item  !== 'string') {
    item = item.get('_id');
  }
  delete this.items[item];
};

Collection.create = function(name, obj) {
  var Collection = function(items) {
    this.collection = Collection;
    this.items = items || {};
    this.model = obj.model;
    if (this.init) {
      this.init();
    }
  };
  Collection.prototype = new this(name);
  aug(Collection.prototype, obj.methods);
  aug(Collection, obj.statics);
  Collection.applyMixin = function(mixin) {
    aug(this.prototype, mixin.methods);
    aug(Collection, mixin.statics);
  };
  return Collection;
};


exports = Collection;

return exports;
})({});
var cs1 = (function(exports) {
var aug = window.aug;
var Events = cs2;

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

exports = Model;

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

return exports;
})({});
var cs0 = (function(exports) {
exports.Model = cs1;
exports.Collection = cs3;

return exports;
})({});
return cs0;
})({});