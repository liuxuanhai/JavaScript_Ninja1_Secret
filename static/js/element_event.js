// 修复事件对象 13.3.html
function fixEvent(event) {

  function returnTrue() { return true; }
  function returnFalse() { return false; }

  if (!event || !event.stopPropagation) {
    var old = event || window.event;

    // Clone the old object so that we can modify the values
    event = {};

    for (var prop in old) {
      event[prop] = old[prop];
    }

    // The event occurred on this element
    if (!event.target) {
      event.target = event.srcElement || document;
    }

    // Handle which other element the event is related to
    event.relatedTarget = event.fromElement === event.target ?
        event.toElement :
        event.fromElement;

    // Stop the default browser action
    event.preventDefault = function () {
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
    };

    event.isDefaultPrevented = returnFalse;

    // Stop the event from bubbling
    event.stopPropagation = function () {
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };

    event.isPropagationStopped = returnFalse;

    // Stop the event from bubbling and executing other handlers
    event.stopImmediatePropagation = function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    };

    event.isImmediatePropagationStopped = returnFalse;

    // Handle mouse position
    if (event.clientX != null) {
      var doc = document.documentElement, body = document.body;

      event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // Handle key presses
    event.which = event.charCode || event.keyCode;

    // Fix button for mouse clicks:
    // 0 == left; 1 == middle; 2 == right
    if (event.button != null) {
      event.button = (event.button & 1 ? 0 :
          (event.button & 4 ? 1 :
              (event.button & 2 ? 2 : 0)));
    }
  }

  return event;

}

// 为元素绑定相关数据 13.4.html
(function(){
    // 定义变量
    var cache={},
        guidCounter=1;
        expando="date"+new Date().getTime();

    // 存储数据
    this.getData=function(elem){
        // 获取节点属性并赋值到变量上
        var guid=elem[expando];
        // 判断该节点属性是否有值
        if(!guid){
            // 为变量、节点赋值ID
            guid=elem[expando]=guidCounter++;
            // 根据id创建对象
            cache[guid]={};
        };
        // 返回对象
        return cache[guid];
    };

    // 删除数据
    this.removeData=function(elem){
        // 获取节点属性并赋值到变量上
        var guid=elem[expando];
        // 判断该节点属性是否有值
        if(!guid) return ;
        // 根据id移除对象
        delete cache[guid];
        // 移除节点属性
        try{
            delete elem[expando];
        }catch(e){
            // 报错则移除节点特性
            if(elem.removeAttribute){
                elem.removeAttribute(expando);
            };
        };
    };
})();

// 一个绑定事件处理程序并进行跟踪的函数 13.5.html
(function(){
    var nextGuid = 1;       //运行计数器，作为独立的标识符
    this.addEvent = function(elem, type, fn){       //接受三个参数，元素、事件类型、处理程序
        var data = getData(elem);       //获取与元素相关的数据，参考13.4.html

        if(!data.handlers) data.handlers = {};

        if(!data.handlers[type])
        data.handlers[type] = [];

        if(!fn.guid) fn.guid = nextGuid++;      //为处理程序添加独立标识符

        data.handlers[type].push(fn);     //处理程序添加到同类型事件的数组中

        if(!data.dispatcher){
            data.disabled = false;
            data.dispatcher = function(event){      //事件发生时出发绑定的函数
                if(data.disabled) return;
                event = fixEvent(event);        //获取修复后的事件对象 参考13.3.html
                console.log(event);
                var handlers = data.handlers[event.type];
                if(handlers){
                    for (var n=0; n<handlers.length; n++){
                        handlers[n].call(elem,event);
                    }
                }
            }
        };

        // 用合适的方法，将dispatcher 方法绑定到元素上面，并只绑定一次
        if(data.handlers[type].length == 1){
            if(document.addEventListener){
                elem.addEventListener(type, data.dispatcher, false);
            }
            else if (document.attachEvent){
                elem.attachEvent("on" + type, data.dispatcher);
            }
        }
    }
})()

// 清理处理程序 13.6.html
function tidyUp(elem,type){

    function isEmpty(object){
        for (var prop in object){
            return false;
        };

        return true;
    };

    var data = getData(elem);       //获取元素相关数据

    if(data.handlers[type].length === 0){
        delete data.handlers[type];

        if(document.removeEventListener){
            elem.removeEventListener(type, data.dispatcher, false);
        }
        else if (document.detachEvent){
            elem.detachEvent("on" + type, data.dispatcher);
        };
    };

    if(isEmpty(data.handlers)){
        delete data.handlers;
        delete data.dispatcher;
    };

    if(isEmpty(data)){
        removeDate(elem);
    };
};

// 事件处理程序的解绑函数 13.7.html
// 需要达成三个目标；
// 1、将一个元素上的所有事件绑定都删除 
// 2、讲一个元素上的指定类型事件绑定删除
// 3、删除一个特定处理程序实例
(function(){
    this.removeEvent = function(elem, type, fn){
        var data = getData(elem);
        
        if(!data.handlers) return;

        // 定义一个函数，用于删除指定类型事件
        var removeType = function(t){
            data.handlers[t] = [];
            tidyUp(elem,t);     //删除指定类型事件，参考13.6.html
        };

        // 删除所有事件
        if(!type){
            for (var t in data.handlers) removeType(t);
            return;
        };

        var handlers = data.handlers[type];
        if(!handlers) return;

        // 删除指定事件
        if(!fn){
            removeType(type);
            return;
        };

        // 删除一个特定处理程序实例
        if(fn.guid){
            for(var n=0; n < handlers.length; n++){
                if(handlers[n].guid === fn.guid){
                    handlers.splice(n--,1);
                }
            }
        };

        // 判断该类型是否为空，是则删除该类型
        tidyUp(elem,type);

    };
})();