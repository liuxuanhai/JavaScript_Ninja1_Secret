// 第二章 测试组套件
function assert(value,desc){
    var li=document.createElement("li");
    li.className=value?"pass":"fail";
    li.appendChild(document.createTextNode(desc));
    document.getElementById("results").appendChild(li);
}