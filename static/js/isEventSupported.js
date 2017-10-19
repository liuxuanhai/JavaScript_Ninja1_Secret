//事件冒泡监测代码 13.11.html
function isEventSupported(eventName){
    var element = document.createElement("div"),
        isSupported;

    eventName = 'on' + eventName;
    isSupported = (eventName in element);

    if(!isSupported){
        element.setAttribute(eventName,'return;');
        isSupported = typeof element[eventName] == 'function';
    }

    element = null;

    return isSupported;
}    