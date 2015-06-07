angular.module('md.data.table').factory('$mdTableRepeat', function () {
  'use strict';
  
  var cache = {};
  
  function Repeat(ngRepeat) {
    this._tokens = ngRepeat.split(' ');
    this._iterator = 0;
    
    this.item = this.current();
    while(this.hasNext() && this.getNext() !== 'in') {
      this.item += this.current();
    }
    
    this.items = this.getNext();
    while(this.hasNext() && ['|', 'track'].indexOf(this.getNext()) === -1) {
      this.items += this.current();
    }
    
    this.orderBy = undefined;
    if(this.hasNext() && this.getNext() === 'orderBy:') {
      this.orderBy = this.getNext();
    }
    
    this.trackBy = undefined;
    if(this.hasNext()) {
      this.trackBy = this.getNext() === 'by' ? this.getNext() : this.current();
    }
  }
  
  Repeat.prototype.current = function () {
    return this._tokens[this._iterator];
  };
  
  Repeat.prototype.getNext = function() {
    return this._tokens[++this._iterator];
  };
  
  Repeat.prototype.getValue = function() {
    return this._tokens.join(' ');
  };
  
  Repeat.prototype.hasNext = function () {
    return this._iterator < this._tokens.length - 1;
  };
  
  Repeat.prototype.insertOrderBy = function (property) {
    this.orderBy = property;
    this._iterator = this.trackBy ? this._tokens.indexOf(this.trackBy) : this._tokens.length;
    this._tokens.splice(this._iterator, 0, '|', 'orderBy:', property);
    return this._tokens.join(' ');
  };
  
  function parse(ngRepeat) {
    if(!cache.hasOwnProperty(ngRepeat)) {
      return (cache[ngRepeat] = new Repeat(ngRepeat));
    }
    return cache[ngRepeat];
  }
  
  return {
    parse: parse
  };
  
});