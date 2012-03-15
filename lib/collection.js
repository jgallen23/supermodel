var aug = require('aug');

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


module.exports = Collection;
