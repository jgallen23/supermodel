var localStorageMixin = {
  statics: {
    _get: function() {
      var json = localStorage.getItem('model-'+this.prototype.modelName);
      json = (json)?JSON.parse(json):{};
      var items = {};
      for (var id in json) {
        items[id] = new this(json[id]);
      }
      return items;
    },
    _set: function(obj) {
      var json = {};
      for (var id in obj) {
        json[id] = obj[id].toJSON();
      }
      localStorage.setItem('model-'+this.prototype.modelName, JSON.stringify(json));
    },
    find: function() {
      return this._get();
    },
    findById: function(id) {
      var items = this._get();
      return items[id];
    },
    findOrCreate: function(obj) {
      var r = this.findById(obj._id);
      if (!r) {
        return new this(obj);
      }
      return r;
    },
    save: function(item) {
      var items = this._get();
      var id = item.get('_id');
      items[id] = item;
      this._set(items);
    },
    remove: function(id) {
      var items = this._get();
      delete items[id];
      this._set(items);
    }
  },
  methods: {
    save: function() {
      this.model.save(this);
    }
  }
};
