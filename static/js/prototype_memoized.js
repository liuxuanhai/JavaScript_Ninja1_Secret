// 第五章 5.5.1 利用闭包实现的函数记忆方法  5.14.html
Function.prototype.memoized = function(key){
    this._value = this._value || {};
    return this._value[key] !== undefined ? this._value[key] : this._value[key] = this.apply(this,arguments);
};

Function.prototype.memoize = function(){
    var fn = this;
    return function(){
        return fn.memoized.apply(fn,arguments);
    };
};