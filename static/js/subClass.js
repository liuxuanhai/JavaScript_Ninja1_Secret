// 定义子类方法 6.21.html

(function () {
    var initializing = false,
        superPattern = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;    //粗糙的正则表达式用于判断函数是否可以被序列化

    //给Object添加一个subclass方法
    Object.subClass = function (properties) {
        var _super = this.prototype;

        initializing = true;    //初始化超类
        var proto = new this();    //初始化超类
        initializing = false;   //初始化超类

        //将属性复制到prototype中
        for (var name in properties) {
            proto[name] = typeof properties[name] == 'function' &&
                typeof _super[name] == 'function' &&
                superPattern.test(properties[name]) ?
                //定义一个重载函数          
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        this._super = _super[name];

                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return tmp;
                    };
                })(name, properties[name]) :
                properties[name];
        };

        //创造一个仿真类构造器
        function Class() {
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            };
        };

        Class.prototype = proto;    //设置类的原型

        Class.constructor = Class;  //重载构造器引用

        Class.subClass = arguments.callee;  //让类继续可扩展

        return Class;
    };
});