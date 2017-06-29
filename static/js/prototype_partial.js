//第五章 5.4偏应用函数 5.12.html
Function.prototype.partial=function(){
    var fn=this,
        args=Array.prototype.slice.call(arguments);
    return function(){
        var arg=0;
        for(var i=0; i < args.length && arg<arguments.length; i++){
            if(args[i]===undefined){
                args[i]=arguments[arg++];
            };
        };
        return fn.apply(this,args)
    };
};;