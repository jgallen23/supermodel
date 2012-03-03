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
module.exports = Events;
