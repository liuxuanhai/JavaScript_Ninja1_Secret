//第五章 5.9.html
Function.prototype.bind=function(){
    var fn=this,
        args=Array.prototype.slice.call(arguments),
        object=args.shift();

    return function(){
        return fn.apply(object,args.conact(Array.prototype.slice(arguments)));
    };
};