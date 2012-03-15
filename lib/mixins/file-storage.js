var fs = require('fs');
var path = require('path');
var Collection = require('../collection');

var fileStorage = function(storagePath) {
  return {
    methods: {
      fetch: function(callback) {
        var self = this;
        if (path.existsSync(storagePath)) {
          fs.readFile(storagePath, 'utf8', function(err, str) {
            if (err) throw err;

            var json = JSON.parse(str);
            var items = {};
            for (var id in json) {
              items[id] = new self.model(json[id]);
            }
            self.items = items;
            callback.call(self);
          });
        } else {
          self.items = {};
          callback.call(self);
        }
      },
      save: function(item) {
        if (item)
          this.add(item);
        fs.writeFile(storagePath, JSON.stringify(this.toJSON()), function(err) {
          if (err) throw err;
        });
      }
    }
    //methods: {
      //save: function() {
        //this.model.save(this);
      //}
    //}
  };
};

module.exports = fileStorage;
