// 第四章 4.4 函数重载
function addMethod(object,name,fn){ 
    var old=object[name];   //保存上一个原有的函数，如果实参数量与形参数量不匹配则执行次函数；
    object[name]=function(){    //创建一个新的匿名函数作为对象的新方法
        if(arguments.length == fn.length){
            return fn.apply(this,arguments);    //该匿名函数的实参数量与形参数量匹配则执行此方法
        }else if(typeof old == "function"){
            return old.apply(this,arguments);   //反之，则执行上一个原有的函数
        }else{
            console.log("尚未定义的方法,没有返回值!argumengs.lenth="+arguments.length);     //实参数量所对应的方法没有定义时返回信息
        };
    };
};